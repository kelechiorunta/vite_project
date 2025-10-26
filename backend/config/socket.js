import { createServer } from 'http';
import { Server } from 'socket.io';
import User from '../models/User.js';
import Chat from '../models/Chat.js';
import ChatMessage from '../models/ChatMessage.js';
import UnreadMsg from '../models/UnreadMsg.js';

import { GridFSBucket } from 'mongodb';
import sharp from 'sharp';
import mongoose from 'mongoose';

const configureSocket = (app, corsOptions, PORT) => {
  const server = createServer(app);
  const socketOptions = { cors: corsOptions };
  const io = new Server(server, socketOptions);

  const onlineUsers = new Map();
  const signedInUsers = new Set();

  io.engine.on('connection', (socket) => {
    console.log(socket?.request?.url);
  });

  io.engine.on('connection_error', (err) => {
    console.error(err.message);
  });

  io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);

    socket.on('signedIn', async ({ userId }) => {
      if (!signedInUsers.has(userId)) {
        signedInUsers.add(userId);
        const signedInUser = await User.findById(userId);
        if (signedInUser) {
          socket.broadcast.emit('SigningIn', { status: 'ok', loggedInUser: signedInUser });
        }
      }
    });

    socket.on('isLoggedIn', async ({ userId }) => {
      socket.data.userId = userId;
      onlineUsers.set(userId, socket.id);
      const signedInUser = await User.findById(userId);
      if (signedInUser) {
        signedInUser.isOnline = true;
        await signedInUser.save();
        socket.broadcast.emit('userOnline', { userId, online: signedInUser.isOnline });
        socket.broadcast.emit('isConnected', { currentUser: userId });

        // socket.broadcast.emit('LoggingIn', { status: 'ok', loggedInUser: signedInUser }); // to others
        socket.emit('LoggingIn', { status: 'ok', loggedInUser: signedInUser }); // to current client
      }

      // Notify others this user came online

      // ✅ Send current online users to the newly logged-in user
      const otherOnlineUsers = [...onlineUsers.keys()].filter((id) => id !== userId);
      // Set isOnline = true in DB for others (optional if you want to persist status)
      for (const id of otherOnlineUsers) {
        const userDoc = await User.findById(id);
        if (userDoc) {
          userDoc.isOnline = true;
          await userDoc.save();
        }
      }
      socket.emit('currentlyOnline', { userIds: otherOnlineUsers, online: true });
    });

    socket.on('isOnline', ({ receiverId, senderId }) => {
      //const senderId = socket.data.userId;
      if (!receiverId || !senderId) return;

      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('isConnected', { currentUser: senderId });
      }
    });

    socket.on('joinChat', ({ userId }) => {
      if (!userId) return;
      console.log(`${userId} joined chat`);
      socket.data.userId = userId;
      socket.join(userId); // Join personal room
    });

    socket.on('markAsRead', async ({ senderId, receiverId }) => {
      if (!senderId || !receiverId) {
        console.warn('❗ senderId or receiverId not provided');
        return;
      }

      try {
        const sender = await User.findById(senderId);
        const recipient = await User.findById(receiverId);

        if (!sender || !recipient) {
          console.warn('❗ Sender or recipient not found in DB');
          return;
        }

        // Check if there are unread messages from sender to this recipient
        const unreadEntry = await UnreadMsg.findOne({
          recipient: recipient._id,
          sender: sender._id,
          unreadMsgs: { $exists: true, $not: { $size: 0 } }
        });

        if (unreadEntry) {
          // Delete the specific unread entry
          const result = await UnreadMsg.deleteOne({
            _id: unreadEntry._id
          });

          console.log(
            `🗑️ Deleted ${result.deletedCount} unread message(s) from ${sender.username} to ${recipient.username}`
          );

          // Emit confirmation only if deletion was successful
          socket.emit('messagesMarkedAsRead', { senderId });
        } else {
          console.log(
            `✅ No unread messages found from ${sender.username} to ${recipient.username}`
          );
        }
      } catch (error) {
        console.error('❌ Error in markAsRead socket handler:', error);
      }
    });

    socket.on('sendMessage', async ({ content, receiverId, hasFile, file }) => {
      const senderId = socket.data.userId;
      if (!senderId || !receiverId || !content) return;

      try {
        // ✅ Find or create the 1-to-1 chat
        let chat = await Chat.findOne({
          members: { $all: [senderId, receiverId], $size: 2 },
          isGroup: false
        });

        if (!chat) {
          chat = new Chat({ members: [senderId, receiverId], isGroup: false });
          await chat.save();
        }

        let fileId = null;
        let placeholderImgId = null;
        let message = null;

        if (hasFile && file) {
          const db = mongoose.connection.db;
          const bucket = new GridFSBucket(db, { bucketName: 'chatPictures' });

          const buffer = Buffer.from(file.data);

          // ✅ Create a placeholder (tiny blurred thumbnail)
          const placeholderBuffer = await sharp(buffer)
            .resize({ width: 20 }) // small thumbnail
            .blur() // add blur effect for lazy loading
            .toBuffer();

          // Upload main file
          const uploadStream = bucket.openUploadStream(file.name, {
            contentType: file.type,
            metadata: { senderId, receiverId }
          });

          uploadStream.end(buffer);

          uploadStream.on('finish', async () => {
            fileId = uploadStream.id;

            // Upload placeholder file
            const placeholderStream = bucket.openUploadStream(`${file.name}-placeholder`, {
              contentType: file.type,
              metadata: { senderId, receiverId, placeholder: true }
            });

            placeholderStream.end(placeholderBuffer);

            placeholderStream.on('finish', async () => {
              placeholderImgId = placeholderStream.id;

              // ✅ Save message with both full & placeholder image IDs
              if (fileId) {
                message = new ChatMessage({
                  chat: chat._id,
                  sender: senderId,
                  receiver: receiverId,
                  content,
                  hasImage: true,
                  imageFileId: fileId,
                  placeholderImgId, // ✅ new field
                  imageUrl: `/proxy/chat-pictures/${fileId.toString()}?t=${Date.now()}`,
                  placeholderUrl: `/proxy/chat-pictures/${placeholderImgId.toString()}`
                });

                await message.save();

                // ✅ Update sender/receiver user data
                const recipientUser = await User.findById(receiverId);
                const senderUser = await User.findById(senderId);

                // ✅ Track unread only if recipient is offline
                senderUser.lastMessage = content;
                senderUser.lastMessageCount = (senderUser.lastMessageCount || 0) + 1;

                // ✅ Add to or update UnreadMsg collection
                let unreadEntry = await UnreadMsg.findOne({
                  recipient: receiverId,
                  sender: senderId
                });

                if (!unreadEntry) {
                  unreadEntry = new UnreadMsg({
                    recipient: recipientUser,
                    sender: senderUser,
                    count: 1,
                    lastMessage: content
                  });
                } else {
                  unreadEntry.count += 1;
                  unreadEntry.lastMessage = content;
                }

                await unreadEntry.save();
                console.log('Saved successfully to Unread messages');

                // Attach to user if not already present
                if (!recipientUser.unread.includes(unreadEntry._id)) {
                  recipientUser.unread.push(unreadEntry._id);
                  await recipientUser.save();
                }

                // // ✅ Populate sender/receiver for frontend
                message = await message.populate([
                  {
                    path: 'sender',
                    select: 'username picture isOnline lastMessage lastMessageCount'
                  },
                  { path: 'receiver', select: 'username picture isOnline' }
                ]);

                chat.messages.push(message._id);
                await chat.save();

                // ✅ Emit to both users
                [senderId, receiverId].forEach((id) => {
                  io.to(id).emit('newMessage', {
                    _id: message._id,
                    chatId: chat._id,
                    sender: message.sender,
                    receiver: message.receiver,
                    content: message.content,
                    createdAt: message.createdAt,
                    updatedAt: message.updatedAt,
                    hasImage: true,
                    imageFileId: fileId || '',
                    // imageId: fileId,
                    placeholderImgId: placeholderImgId || '',
                    imageUrl: message.imageUrl || '',
                    placeholderUrl: message.placeholderUrl || '', // ✅ send placeholder to client
                    lastMessage: content,
                    unreadCounts: recipientUser.unreadCounts,
                    unreadMsgs: recipientUser.unread
                  });
                });
              }
            });
          });
        }

        // Save without pictures/images
        else {
          // ✅ Create and save new message
          let message = new ChatMessage({
            chat: chat._id,
            sender: senderId,
            receiver: receiverId,
            content
          });

          await message.save();

          // ✅ Update sender/receiver user data
          const recipientUser = await User.findById(receiverId);
          const senderUser = await User.findById(senderId);

          // ✅ Track unread only if recipient is offline
          //   const isRecipientOnline = onlineUsers && onlineUsers.has(receiverId);
          // if (!isRecipientOnline) {
          // Update sender metadata
          senderUser.lastMessage = content;
          senderUser.lastMessageCount = (senderUser.lastMessageCount || 0) + 1;

          // ✅ Add to or update UnreadMsg collection
          let unreadEntry = await UnreadMsg.findOne({
            recipient: receiverId,
            sender: senderId
          });

          if (!unreadEntry) {
            unreadEntry = new UnreadMsg({
              recipient: recipientUser,
              sender: senderUser,
              count: 1,
              lastMessage: content
            });
          } else {
            unreadEntry.count += 1;
            unreadEntry.lastMessage = content;
          }

          await unreadEntry.save();
          console.log('Saved successfully to Unread messages');

          // Attach to user if not already present
          if (!recipientUser.unread.includes(unreadEntry._id)) {
            recipientUser.unread.push(unreadEntry._id);
            await recipientUser.save();
          }
          // }

          // ✅ Add message to chat
          chat.messages.push(message._id);
          await chat.save();

          // ✅ Populate sender/receiver for frontend
          message = await message.populate([
            { path: 'sender', select: 'username picture isOnline lastMessage lastMessageCount' },
            { path: 'receiver', select: 'username picture isOnline' }
          ]);

          // ✅ Emit updated message to both users
          [senderId, receiverId].forEach((id) => {
            io.to(id).emit('newMessage', {
              _id: message._id,
              chatId: chat._id,
              sender: message.sender,
              receiver: message.receiver,
              content: message.content,
              createdAt: message.createdAt,
              lastMessage: content,
              unreadCounts: recipientUser.unreadCounts,
              unreadMsgs: recipientUser.unread
            });
          });
        }
      } catch (error) {
        console.error('❌ sendMessage error:', error);
      }
    });

    socket.on('ProfileUpdated', ({ updatedUser }) => {
      if (updatedUser) {
        // Don't broadcast
        socket.broadcast.emit('UpdatedProfile', { updatedProfileUser: updatedUser });
      }
    });

    // socket.on('typing', ({ receiverId }) => {
    //     const senderId = socket.data.userId;
    //     if (!receiverId || !senderId) return;

    //     // Emit 'typing' to the receiver's room
    //     io.to(receiverId).emit('typing', { from: senderId });
    // });

    socket.on('typing', ({ receiverId }) => {
      const senderId = socket.data.userId;
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('typingIndication', { from: senderId });
      }
    });

    socket.on('disconnect', async () => {
      console.log('🔴 Client disconnected:', socket.id);
      const userId = socket.data.userId;
      if (userId) {
        const signedOutUser = await User.findById(userId);
        if (signedOutUser) {
          signedOutUser.isOnline = false;
          await signedOutUser.save();
          onlineUsers.delete(userId);
          signedInUsers.delete(userId);
          socket.broadcast.emit('userOffline', { userId, signedOutUser });
          socket.broadcast.emit('LoggingOut', { signedOutUser: signedOutUser });
        }
      }
    });
  });

  server.listen(PORT, () => {
    console.log(' Socket listening at ws://localhost:3002');
  });
};

export default configureSocket;
