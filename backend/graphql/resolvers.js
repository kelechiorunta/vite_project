import User from '../models/User.js';
import Chat from '../models/Chat.js';
import UnreadMsg from '../models/UnreadMsg.js';
import Group from '../models/Group.js';
import Message from '../models/Message.js';
import ChatMessage from '../models/ChatMessage.js';
import sharp from 'sharp';
import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';
// import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

const formatUnreadCounts = (unreadMap) => {
  if (!(unreadMap instanceof Map)) return [];

  return Array.from(unreadMap.entries()).map(([senderId, data]) => ({
    senderId,
    data
  }));
};

const resolvers = {
  // Upload: GraphQLUpload,

  Query: {
    users: async (_, args, context) => {
      if (!context?.user) return [];

      try {
        const users = await User.find({ _id: { $ne: context.user._id } });

        const enhancedUsers = users.map((user) => {
          const userObj = user.toObject();
          userObj.unreadCounts = formatUnreadCounts(user.unreadCounts);
          return userObj;
        });

        return enhancedUsers;
      } catch (error) {
        console.error(error);
        throw new Error('Failed to fetch users');
      }
    },

    auth: async (_, args, context) => {
      if (!context?.user) return null;

      const user = await User.findById(context.user._id);
      const userObj = user.toObject();
      userObj.unreadCounts = formatUnreadCounts(user.unreadCounts);
      // // Example usage: emit to a room
      // io.to(user._id.toString()).emit('user:authCheck', { status: 'ok' });
      // io.broadcast.emit('LoggingIn', { status: 'ok', loggedInUser: user });

      return userObj;
    },

    getUnread: async (_, { senderIds, recipientId }) => {
      try {
        // Validate recipient
        const recipient = await User.findById(recipientId);
        if (!recipient) throw new Error('Recipient not found');

        // Fetch all unread entries in parallel
        const results = await Promise.all(
          senderIds.map(async (senderId) => {
            const unreadEntry = await UnreadMsg.findOne({
              sender: senderId,
              recipient: recipientId
            });

            return {
              senderId,
              count: unreadEntry?.count || 0,
              lastMessage: unreadEntry?.lastMessage || '',
              createdAt: unreadEntry?.createdAt || null,
              updatedAt: unreadEntry?.updatedAt || null // optional
            };
          })
        );

        return results; // GraphQL returns an array of { senderId, count, lastMessage }
      } catch (err) {
        console.error('❌ getUnread error:', err);
        throw new Error('Failed to get unread count');
      }
    },
    // Former resolver for fetching chat messages without picture streaming

    // fetchChats: async (_, { userId, currentUserId }, context) => {
    //   try {
    //     if (!currentUserId) {
    //       throw new Error('Unauthorized');
    //     }
    //     if (!userId) {
    //       throw new Error('Missing userId');
    //     }

    //     const chat = await Chat.findOne({
    //       members: { $all: [currentUserId, userId], $size: 2 },
    //       isGroup: false
    //     }).populate({
    //       path: 'messages',
    //       model: 'ChatMessage',
    //       options: { sort: { createdAt: 1 } },
    //       populate: {
    //         path: 'sender receiver',
    //         model: 'User',
    //         select: 'username _id picture isOnline lastMessage lastMessageCount unread'
    //       }
    //     });

    //     if (!chat) {
    //       return { messages: [], notifiedUser: null };
    //     }

    //     const selectedUser = await User.findById(userId);
    //     const currentUser = await User.findById(currentUserId);

    //     if (selectedUser) {
    //       selectedUser.lastMessageCount = 0;
    //       await selectedUser.save();
    //     }

    //     // const unreadEntry = await UnreadMsg.findOne({
    //     //   recipient: selectedUser._id,
    //     //   sender: currentUser._id,
    //     //   unreadMsgs: { $exists: true, $not: { $size: 0 } }
    //     // });

    //     // if (unreadEntry) {
    //     //   await UnreadMsg.deleteOne({ _id: unreadEntry._id });
    //     //   console.log(`🗑️ Cleared unread messages for ${selectedUser.username}`);
    //     // }

    //     return {
    //       messages: chat.messages,
    //       notifiedUser: currentUser
    //     };
    //   } catch (err) {
    //     console.error('❌ Error in fetchChats:', err);
    //     throw new Error('Internal server error');
    //   }
    // },

    fetchChats: async (_, { userId, currentUserId }) => {
      try {
        // ✅ Fetch sender and receiver messages with lean (plain JS objects, much faster)
        const messages = await ChatMessage.find({
          $or: [
            { sender: userId, receiver: currentUserId },
            { sender: currentUserId, receiver: userId }
          ]
        })
          .sort({ createdAt: 1 }) // oldest → newest
          .populate('sender', '_id username picture')
          .populate('receiver', '_id username picture')
          .lean(); // ⚡ returns plain JS objects instead of full mongoose docs

        // ✅ Optionally fetch "notifiedUser" with lean
        const notifiedUser = await User.findById(userId).lean();

        // ✅ Transform messages to include image/placeholder URLs
        const enhancedMessages = messages.map((msg) => ({
          ...msg,
          imageUrl: msg.imageFileId
            ? `${
                process.env.NODE_ENV === 'production'
                  ? 'https://vite-project-kjia.onrender.com'
                  : 'http://localhost:3302'
              }/proxy/chat-pictures/${msg.imageFileId.toString()}?t=${Date.now()}` ||
              `${
                process.env.NODE_ENV === 'production'
                  ? 'https://vite-project-kjia.onrender.com'
                  : 'http://localhost:3302'
              }/proxy/chat-pictures/group/${msg.imageFileId.toString()}?t=${Date.now()}`
            : msg.imageUrl && msg.imageUrl.length > 0
            ? msg.imageUrl
            : null,
          placeholderUrl: msg.placeholderImgId
            ? `${
                process.env.NODE_ENV === 'production'
                  ? 'https://vite-project-kjia.onrender.com'
                  : 'http://localhost:3302'
              }/proxy/chat-pictures/${msg.placeholderImgId.toString()}?t=${Date.now()}` ||
              `${
                process.env.NODE_ENV === 'production'
                  ? 'https://vite-project-kjia.onrender.com'
                  : 'http://localhost:3302'
              }/proxy/chat-pictures/group/${msg.placeholderImgId.toString()}?t=${Date.now()}`
            : null
        }));

        return {
          messages: enhancedMessages,
          notifiedUser
        };
      } catch (err) {
        console.error('❌ fetch_chats error:', err);
        throw new Error('Failed to fetch chat history');
      }
    },
    fetchGroups: async (_, __, { user }) => {
      if (!user) throw new Error('Unauthorized');

      try {
        // ✅ Query only groups where user._id is in members
        const userGroups = await Group.find({
          members: { $in: [user._id] }
        }).populate('members');
        console.log(userGroups);
        return userGroups;
      } catch (err) {
        console.error('❌ Error fetching groups:', err);
        throw new Error('Failed to fetch groups');
      }
    },

    fetchGroupMsgs: async (_, { groupId, limit = 30, cursor }, { user }) => {
      if (!user) throw new Error('Unauthorized');

      const group = await Group.findById(groupId).populate('members');
      if (!group) throw new Error('Group not found');
      if (!group.members.some((m) => m._id.toString() === user._id.toString())) {
        throw new Error('Not a member of this group');
      }

      // Always query with string
      const query = { groupId: groupId.toString() };
      if (cursor) {
        query._id = { $lt: cursor };
      }

      const messages = await Message.find(query)
        .populate('sender')
        .sort({ createdAt: -1 })
        .limit(limit);

      console.log('📩 Found group messages:', messages.length, 'for groupId:', groupId);
      console.log('Messages:', messages);

      return { messages: messages.reverse() };
    }
  },

  Mutation: {
    // // Send a group message and emit event
    // sendGroupMessage: async (_, { groupId, sender, content }, { user }) => {
    //   // const user = await User.findById(sender);
    //   if (!user) throw new Error('User not found');

    //   const message = await Message.create({
    //     content,
    //     groupId,
    //     sender,
    //     senderName: user.username,
    //     senderAvatar: user.picture,
    //     createdAt: new Date().toISOString()
    //   });

    //   return message;
    // },

    // LAST CODE BEFORE UPLOAD. REVERT IF NEEDED
    sendGroupMessage: async (_, { groupId, sender, content, hasFile, file }, { user }) => {
      try {
        // Validate sender
        const senderUser = user || (await User.findById(sender));
        if (!senderUser) throw new Error('User not found');

        let fileId = null;
        let placeholderImgId = null;
        let imageUrl = null;
        let placeholderUrl = null;

        // ✅ Handle file upload if hasFile is true
        if (hasFile && file) {
          const db = mongoose.connection.db;
          const bucket = new GridFSBucket(db, { bucketName: 'chatPictures' });

          // Convert Base64 → Buffer
          const buffer = Buffer.from(file.data, 'base64');

          // Create small blurred placeholder
          const placeholderBuffer = await sharp(buffer).resize({ width: 20 }).blur().toBuffer();

          // Upload main image
          const uploadMain = await new Promise((resolve, reject) => {
            const uploadStream = bucket.openUploadStream(file.name, {
              contentType: file.type,
              metadata: { sender, groupId, type: 'main' }
            });
            uploadStream.end(buffer);
            uploadStream.on('finish', () => resolve(uploadStream.id));
            uploadStream.on('error', reject);
          });

          fileId = uploadMain;

          // Upload placeholder image
          const uploadPlaceholder = await new Promise((resolve, reject) => {
            const placeholderStream = bucket.openUploadStream(`${file.name}-placeholder`, {
              contentType: file.type,
              metadata: { sender, groupId, type: 'placeholder' }
            });
            placeholderStream.end(placeholderBuffer);
            placeholderStream.on('finish', () => resolve(placeholderStream.id));
            placeholderStream.on('error', reject);
          });

          placeholderImgId = uploadPlaceholder;

          // Build URLs for client to fetch later
          imageUrl = `/proxy/chat-pictures/${fileId.toString()}?t=${Date.now()}`;
          placeholderUrl = `/proxy/chat-pictures/${placeholderImgId.toString()}`;
        }

        // ✅ Create and save the message
        const message = await Message.create({
          groupId,
          sender,
          senderName: senderUser.username,
          senderAvatar: senderUser.picture,
          content,
          hasImage: !!hasFile,
          imageFileId: fileId,
          placeholderImgId,
          imageUrl,
          placeholderUrl,
          createdAt: new Date().toISOString()
        });

        return message;
      } catch (error) {
        console.error('❌ Error sending group message:', error);
        throw new Error('Failed to send group message');
      }
    }

    // FAILED TO INSTALL CREATEUPLOADLINK IN APOLLO CLIENT. Dependency issues.
    // sendGroupMessage: async (_, { groupId, sender, content, hasFile, file }, { user }) => {
    //   if (!user) throw new Error('User not found');

    //   let fileId = null;
    //   let placeholderImgId = null;
    //   let message = null;

    //   if (hasFile && file) {
    //     const { createReadStream, filename, mimetype } = await file;
    //     const stream = createReadStream();

    //     const chunks = [];
    //     for await (const chunk of stream) {
    //       chunks.push(chunk);
    //     }
    //     const buffer = Buffer.concat(chunks);

    //     const db = mongoose.connection.db;
    //     const bucket = new GridFSBucket(db, { bucketName: 'chatPictures' });

    //     const placeholderBuffer = await sharp(buffer).resize({ width: 20 }).blur().toBuffer();

    //     const uploadStream = bucket.openUploadStream(filename, {
    //       contentType: mimetype,
    //       metadata: { senderId: sender, groupId }
    //     });

    //     uploadStream.end(buffer);

    //     await new Promise((resolve) => uploadStream.on('finish', resolve));
    //     fileId = uploadStream.id;

    //     const placeholderStream = bucket.openUploadStream(`${filename}-placeholder`, {
    //       contentType: mimetype,
    //       metadata: { senderId: sender, groupId, placeholder: true }
    //     });

    //     placeholderStream.end(placeholderBuffer);

    //     await new Promise((resolve) => placeholderStream.on('finish', resolve));
    //     placeholderImgId = placeholderStream.id;

    //     message = await Message.create({
    //       groupId,
    //       sender,
    //       content,
    //       hasImage: true,
    //       imageFileId: fileId,
    //       placeholderImgId,
    //       imageUrl: `/proxy/chat-pictures/${fileId.toString()}`,
    //       placeholderUrl: `/proxy/chat-pictures/${placeholderImgId.toString()}`,
    //       createdAt: new Date().toISOString()
    //     });

    //     return message;
    //   }

    //   // Text-only message
    //   return await Message.create({
    //     groupId,
    //     sender,
    //     content,
    //     hasImage: false,
    //     createdAt: new Date().toISOString()
    //   });
    // }

    // updateProfile: async (_, { input }, { user, ioInstance }) => {
    //   if (!user) throw new Error('Not authenticated');

    //   try {
    //     if (input.email) {
    //       const existingEmailUser = await User.findOne({ email: input.email });

    //       // // If the email exists and doesn't belong to the current user, block it
    //       // if (existingEmailUser && existingEmailUser._id.toString() !== user._id.toString()) {
    //       //   throw new Error("Email is already taken by another user");
    //       // }
    //       if (existingEmailUser) {
    //         const updated = await User.findByIdAndUpdate(existingEmailUser._id, input, {
    //           new: true,
    //           runValidators: true
    //         });

    //         if (ioInstance && existingEmailUser) {
    //           ioInstance.emit('Updating', { updatedUser: updated });
    //         }
    //         return {
    //           success: true,
    //           message: 'Profile updated successfully',
    //           user: updated
    //         };
    //       }
    //     }
    //   } catch (err) {
    //     return {
    //       success: false,
    //       message: err.message || 'Failed to update profile',
    //       user: null
    //     };
    //   }
    // },

    // createUnread: async (_, { input }) => {
    //   const { senderId, recipientId, newMessage } = input;
    //   try {
    //     // Find existing unread record for this recipient/sender pair
    //     let unread = await UnreadMsg.findOne({ sender: senderId, recipient: recipientId });
    //     if (!unread) {
    //       // Create a new one if it doesn't exist
    //       unread = new UnreadMsg({
    //         sender: senderId,
    //         recipient: recipientId,
    //         count: 1,
    //         lastMessage: newMessage
    //       });
    //     } else {
    //       // Update existing one
    //       unread.count += 1;
    //       unread.lastMessage = newMessage;
    //     }
    //     await unread.save();
    //     return {
    //       count: unread.count,
    //       lastMessage: unread.lastMessage
    //     };
    //   } catch (err) {
    //     console.error('❌ createUnread error:', err);
    //     throw new Error('Failed to update unread count');
    //   }
    // },

    // clearUnread: async (_, { senderId, recipientId }) => {
    //   try {
    //     const unread = await UnreadMsg.findOne({ sender: senderId, recipient: recipientId });

    //     if (!unread) return true; // Nothing to clear

    //     unread.count = 0;
    //     await unread.save();

    //     return true;
    //   } catch (err) {
    //     console.error('❌ clearUnread error:', err);
    //     return false;
    //   }
    // },

    // markMessagesAsRead: async (_, { senderId }, context) => {
    //   const recipientId = context.user?._id;
    //   if (!recipientId) throw new Error('Unauthorized');

    //   try {
    //     await UnreadMsg.deleteMany({
    //       sender: senderId,
    //       recipient: recipientId
    //     });

    //     return true;
    //   } catch (err) {
    //     console.error('❌ markMessagesAsRead error:', err);
    //     return false;
    //   }
    // }
  }
};

export default resolvers;
