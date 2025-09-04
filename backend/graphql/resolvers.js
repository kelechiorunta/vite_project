import User from '../models/User.js';
import Chat from '../models/Chat.js';
import UnreadMsg from '../models/UnreadMsg.js';

const formatUnreadCounts = (unreadMap) => {
  if (!(unreadMap instanceof Map)) return [];

  return Array.from(unreadMap.entries()).map(([senderId, data]) => ({
    senderId,
    data
  }));
};

const resolvers = {
  Query: {
    users: async (_, args, context) => {
      if (!context?.user) return [];

      // if (context.ioInstance && context.user) {
      //   context.ioInstance.emit('LoggingIn', {
      //     status: 'ok',
      //     loggedInUser: context.user
      //   });
      //   console.log('loggingin');
      // }

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

    fetchChats: async (_, { userId, currentUserId }, context) => {
      try {
        if (!currentUserId) {
          throw new Error('Unauthorized');
        }
        if (!userId) {
          throw new Error('Missing userId');
        }

        const chat = await Chat.findOne({
          members: { $all: [currentUserId, userId], $size: 2 },
          isGroup: false
        }).populate({
          path: 'messages',
          model: 'ChatMessage',
          options: { sort: { createdAt: 1 } },
          populate: {
            path: 'sender receiver',
            model: 'User',
            select: 'username _id picture isOnline lastMessage lastMessageCount unread'
          }
        });

        if (!chat) {
          return { messages: [], notifiedUser: null };
        }

        const selectedUser = await User.findById(userId);
        const currentUser = await User.findById(currentUserId);

        if (selectedUser) {
          selectedUser.lastMessageCount = 0;
          await selectedUser.save();
        }

        // const unreadEntry = await UnreadMsg.findOne({
        //   recipient: selectedUser._id,
        //   sender: currentUser._id,
        //   unreadMsgs: { $exists: true, $not: { $size: 0 } }
        // });

        // if (unreadEntry) {
        //   await UnreadMsg.deleteOne({ _id: unreadEntry._id });
        //   console.log(`🗑️ Cleared unread messages for ${selectedUser.username}`);
        // }

        return {
          messages: chat.messages,
          notifiedUser: currentUser
        };
      } catch (err) {
        console.error('❌ Error in fetchChats:', err);
        throw new Error('Internal server error');
      }
    }
  }

  //   Mutation: {
  //     updateProfile: async (_, { input }, { user, ioInstance }) => {
  //       if (!user) throw new Error('Not authenticated');

  //       try {
  //         if (input.email) {
  //           const existingEmailUser = await User.findOne({ email: input.email });

  //           // // If the email exists and doesn't belong to the current user, block it
  //           // if (existingEmailUser && existingEmailUser._id.toString() !== user._id.toString()) {
  //           //   throw new Error("Email is already taken by another user");
  //           // }
  //           if (existingEmailUser) {
  //             const updated = await User.findByIdAndUpdate(existingEmailUser._id, input, {
  //               new: true,
  //               runValidators: true
  //             });

  //             if (ioInstance && existingEmailUser) {
  //               ioInstance.emit('Updating', { updatedUser: updated });
  //             }
  //             return {
  //               success: true,
  //               message: 'Profile updated successfully',
  //               user: updated
  //             };
  //           }
  //         }
  //       } catch (err) {
  //         return {
  //           success: false,
  //           message: err.message || 'Failed to update profile',
  //           user: null
  //         };
  //       }
  //     },

  //     createUnread: async (_, { input }) => {
  //       const { senderId, recipientId, newMessage } = input;
  //       try {
  //         // Find existing unread record for this recipient/sender pair
  //         let unread = await UnreadMsg.findOne({ sender: senderId, recipient: recipientId });
  //         if (!unread) {
  //           // Create a new one if it doesn't exist
  //           unread = new UnreadMsg({
  //             sender: senderId,
  //             recipient: recipientId,
  //             count: 1,
  //             lastMessage: newMessage
  //           });
  //         } else {
  //           // Update existing one
  //           unread.count += 1;
  //           unread.lastMessage = newMessage;
  //         }
  //         await unread.save();
  //         return {
  //           count: unread.count,
  //           lastMessage: unread.lastMessage
  //         };
  //       } catch (err) {
  //         console.error('❌ createUnread error:', err);
  //         throw new Error('Failed to update unread count');
  //       }
  //     },

  //     clearUnread: async (_, { senderId, recipientId }) => {
  //       try {
  //         const unread = await UnreadMsg.findOne({ sender: senderId, recipient: recipientId });

  //         if (!unread) return true; // Nothing to clear

  //         unread.count = 0;
  //         await unread.save();

  //         return true;
  //       } catch (err) {
  //         console.error('❌ clearUnread error:', err);
  //         return false;
  //       }
  //     },

  //     markMessagesAsRead: async (_, { senderId }, context) => {
  //       const recipientId = context.user?._id;
  //       if (!recipientId) throw new Error('Unauthorized');

  //       try {
  //         await UnreadMsg.deleteMany({
  //           sender: senderId,
  //           recipient: recipientId
  //         });

  //         return true;
  //       } catch (err) {
  //         console.error('❌ markMessagesAsRead error:', err);
  //         return false;
  //       }
  //     }
  //   }
};

export default resolvers;
