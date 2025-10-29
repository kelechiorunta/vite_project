// const Home: React.FC = () => {
//   const [selectedContact, setSelectedContact] = React.useState<string | null>(null);
//   const [drawerOpen, setDrawerOpen] = React.useState(false);

//   const isMobile = useMediaQuery('(max-width: 768px)');

//   return (
//     <Theme
//       appearance="light"
//       radius="large"
//       scaling="100%"
//       accentColor="cyan"
//       grayColor="slate"
//       panelBackground="solid"
//     >
//       <Flex
//         style={{
//           height: '100vh',
//           width: '100vw',
//           overflow: 'hidden'
//         }}
//       >
//         {/* IconBar (add toggle button for drawer on mobile) */}
//         <IconBar onOpenContacts={() => setDrawerOpen(true)} />

//         {isMobile ? (
//           <>
//             {/* Mobile Drawer for ContactBar */}
//             <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
//               <Dialog.Portal>
//                 <Dialog.Overlay
//                   style={{
//                     position: 'fixed',
//                     inset: 0,
//                     background: 'rgba(0,0,0,0.3)'
//                   }}
//                 />
//                 <Dialog.Content
//                   style={{
//                     position: 'fixed',
//                     top: 0,
//                     left: 0,
//                     height: '100%',
//                     width: '80%',
//                     background: 'white',
//                     borderRight: '1px solid var(--gray-a5)',
//                     display: 'flex',
//                     flexDirection: 'column'
//                   }}
//                 >
//                   <ContactBar
//                     onSelectContact={(id) => {
//                       setSelectedContact(id);
//                       setDrawerOpen(false);
//                     }}
//                   />
//                 </Dialog.Content>
//               </Dialog.Portal>
//             </Dialog.Root>

//             {/* Chat Body (full width on mobile) */}
//             <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
//               <ChatBody contactId={selectedContact} />
//             </Box>
//           </>
//         ) : (
//           <>
//             {/* Contact List (desktop only) */}
//             <Box
//               style={{
//                 flex: '0 0 280px',
//                 borderRight: '1px solid var(--gray-a5)',
//                 display: 'flex',
//                 flexDirection: 'column'
//               }}
//             >
//               <ContactBar onSelectContact={setSelectedContact} />
//             </Box>

//             {/* Chat Body */}
//             <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
//               <ChatBody contactId={selectedContact} />
//             </Box>
//           </>
//         )}
//       </Flex>
//     </Theme>
//   );
// };

// export default Home;

// Home.tsx
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Theme, Flex, Box, Button } from '@radix-ui/themes';
import { useQuery, useLazyQuery } from '@apollo/client/react';
import { io, Socket } from 'socket.io-client';
import debounce from 'lodash.debounce';
import { useApolloClient } from '@apollo/client/react';

import {
  AUTH,
  GET_CONTACTS,
  FETCH_CHATS,
  GET_UNREAD,
  FETCH_GROUPS,
  FETCH_GROUP_MSGS
  // SEND_GROUP_MESSAGE
} from '../../graphql/queries/queries';

import IconBar from '../IconBar/IconBar';
import ContactBar from '../ContactBar/ContactBar';
import ChatBody from '../ChatBody/ChatBody';
import { useTheme } from '../theme-context';
import SocketNotifications from '../Notifications/SocketNotifications';

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

export type UnreadType = {
  count: number;
  updatedAt: unknown | string;
  sender: AuthContextType;
  lastMessage: string;
};

export type AuthContextType = {
  _id?: unknown | string;
  username?: string;
  name?: string;
  logo?: string;
  email?: string;
  address?: string;
  picture?: string;
  phone?: string;
  gender?: string;
  birthday?: string;
  backgroundImage?: string;
  lastMessage?: string;
  isOnline?: boolean | undefined;
  videoId?: unknown;
  unread?: UnreadType;
  backgroundImageId?: unknown;
  backgroundPlaceholderId?: unknown;
  occupation?: string;
  members?: object[];
};

export type ChatMessage = {
  _id: unknown | string;
  chatId: unknown | string;
  sender: AuthContextType;
  receiver: AuthContextType;
  content: string;
  createdAt: string;
  lastMessage: string;
  senderId?: string;
  senderName?: string;
  receiverName?: string;
  receiverAvatar?: string;
  senderAvatar?: string;
  imageUrl: string;
  placeholderUrl: string;
  hasImage: boolean;
  placeholderImgId: string;
  imageFileId: unknown | string;
  // unreadCounts: recipientUser.unreadCounts,
  // unreadMsgs: recipientUser.unread
};

type UnreadInfo = {
  senderId?: string;
  count: number;
  lastMessage: string;
  createdAt?: string | number;
  updatedAt?: string | number;
  timeStamp?: string; // if you add later
};

export type UnreadMap = Record<string, UnreadInfo>; //

type FetchChatsData = {
  fetchChats: {
    messages: ChatMessage[];
    notifiedUser: AuthContextType;
  };
};

type FetchChatsVars = {
  userId: unknown | string;
  currentUserId: unknown | string;
};

type FetchGroupData = {
  fetchGroupMsgs: {
    messages: Message[];
    notifiedUser: AuthContextType;
  };
};

type FetchGroupVars = {
  groupId?: unknown | string;
  limit?: number;
  cursor?: string | null;
};
// Data shape returned from GraphQL
type GetUnreadData = {
  getUnread: UnreadInfo[];
};

// Variables your query needs
type GetUnreadVars = {
  senderIds: string[] | undefined;
  recipientId: string | undefined; // adjust based on your schema
};

export type groupType = {
  _id?: string;
  name?: string;
  description?: string;
  picture?: string;
  username?: string;
  logo?: string;
  createdAt?: string;
  members?: AuthContextType[];
};

export type GetGroups = {
  fetchGroups: groupType[];
};

export type SendGroupMessageData = {
  sendGroupMessage: Message; // 👈 whatever your mutation returns
};

export type SendGroupMessageVars = {
  groupId: string;
  sender: string;
  content: string;
  hasFile: boolean;
  file: FileInput | null;
};

export type FileInput = {
  name: unknown | string;
  type: unknown | string;
  size: unknown | number;
  data: unknown | string; // URL or GridFS reference
};

export type OnlineUser = { _id: string };

export type TabTypes = 'all' | 'groups';

export type Message = {
  _id: string;
  sender?: AuthContextType | string;
  senderAvatar?: string;
  receiverAvatar?: string;
  senderId?: string;
  receiverId?: string;
  content?: string;
  groupId?: string;
  timestamp: string;
  senderName?: string | undefined;
  receiverName?: string;
  imageUrl: string;
  imageFileId: unknown | string;
  placeholderUrl: string;
  placeholderImgId: string;
  hasImage: boolean;
};

const Home: React.FC = () => {
  const [selectedContact, setSelectedContact] = React.useState<AuthContextType | null>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { appTheme } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[] | Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [selectedChat, _setSelectedChat] = useState<AuthContextType | null>(null);
  const [selectedGroup, _setSelectedGroup] = useState<groupType | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [_isOnline, setIsOnline] = useState(null);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [input, setInput] = useState('');
  const [tab, setTab] = useState<TabTypes>('all');
  const client = useApolloClient();

  const [unreadMap, setUnreadMap] = useState<UnreadMap>({});
  const authUser = useOutletContext<AuthContextType>();
  const { data } = useQuery<{ auth: AuthContextType }>(AUTH);
  const {
    data: contacts,
    loading: contacts_loading,
    error: contacts_error
  } = useQuery<{ users: AuthContextType[] | undefined }>(GET_CONTACTS, {
    fetchPolicy: 'cache-and-network'
  });
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null); // ✅ new state

  // const [sendGroupMessage] = useMutation<SendGroupMessageData, SendGroupMessageVars>(
  //   SEND_GROUP_MESSAGE,
  //   {
  //     update(cache, { data }) {
  //       const newMessage = data?.sendGroupMessage;
  //       if (!newMessage || !selectedGroup?._id) return;

  //       const existing = cache.readQuery<FetchGroupData>({
  //         query: FETCH_GROUP_MSGS,
  //         variables: { groupId: selectedGroup._id, limit: 30 }
  //       });

  //       if (existing?.fetchGroupMsgs?.messages) {
  //         cache.writeQuery<FetchGroupData>({
  //           query: FETCH_GROUP_MSGS,
  //           variables: { groupId: selectedGroup._id, limit: 30 },
  //           data: {
  //             fetchGroupMsgs: {
  //               ...existing.fetchGroupMsgs,
  //               messages: [...existing.fetchGroupMsgs.messages, newMessage]
  //             }
  //           }
  //         });
  //         // setMessages(data?.fetchGroupMsgs);
  //       }
  //     }
  //   }
  // );

  const [loadChats, { data: _chatData, loading: loadingChats, error: _errorChats }] = useLazyQuery<
    FetchChatsData,
    FetchChatsVars
  >(FETCH_CHATS, {
    fetchPolicy: 'cache-first' // ✅ serve cache first
    // nextFetchPolicy: 'cache-first' // ✅ after first load, stick to cache
  });

  const [fetchGroupMsgs, { loading: _grpMsgLoading, error: _errGrpMsg }] = useLazyQuery<
    FetchGroupData,
    FetchGroupVars
  >(FETCH_GROUP_MSGS, { fetchPolicy: 'cache-and-network' });

  const {
    data: groupData,
    loading: loadingGroups,
    error: _errorLoading
  } = useQuery<GetGroups>(FETCH_GROUPS);

  const user = data?.auth;
  const users = contacts?.users;
  const groups = groupData?.fetchGroups;

  useEffect(() => {
    const host = window.location.hostname;
    const port = 3302;
    const socketServerURL =
      process.env.NODE_ENV === 'production'
        ? 'https://vite-project-kjia.onrender.com'
        : `http://${host}:${port}`;
    console.log(socketServerURL);

    const socketInstance = io(socketServerURL, {
      transports: ['websocket'],
      // extraHeaders: ['Authorization', 'Content-Type'],
      withCredentials: true
    });

    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const {
    data: unreadData,
    error: _unreadError,
    loading: _unreadLoading
  } = useQuery<GetUnreadData, GetUnreadVars>(GET_UNREAD, {
    variables: {
      senderIds: users?.map((u) => u?._id) as string[],
      recipientId: user?._id as string
    },
    skip: !user || !users?.length,
    fetchPolicy: 'network-only' // optional: always fetch fresh
  });

  useEffect(() => {
    if (!user || !users || users.length === 0 || !unreadData) return;

    const fetchAllUnreadCounts = () => {
      const unreadMapTemp: UnreadMap = {};

      try {
        console.log(unreadData);
        unreadData?.getUnread?.forEach(({ senderId, count, lastMessage, createdAt, updatedAt }) => {
          console.log(createdAt);
          unreadMapTemp[senderId as string] = {
            count: count || 0,
            lastMessage: lastMessage || '',
            timeStamp: updatedAt as string
          };
        });

        setUnreadMap(unreadMapTemp);
      } catch (err) {
        console.error(`❌ Failed to fetch unread count`, err);
      }
    };

    fetchAllUnreadCounts();
  }, [users, user, unreadData]);

  useEffect(() => {
    if (!socket || !user?._id) return;

    // Emit login status and join
    socket.emit('isLoggedIn', { userId: user._id });
    socket.emit('signedIn', { userId: user._id });
    socket.emit('joinChat', { userId: user._id });

    if (selectedContact?._id) {
      socket.emit('isOnline', { receiverId: selectedContact._id, senderId: user._id });
    }

    socket.on('newMessage', (msg: ChatMessage) => {
      const isSender = msg?.sender?._id === selectedContact?._id;
      const isReceiver = msg.receiver?._id === selectedContact?._id;

      if (isSender || isReceiver) {
        setMessages((prev) => [...(prev as ChatMessage[]), msg]);
        client.cache.updateQuery<FetchChatsData, FetchChatsVars>(
          {
            query: FETCH_CHATS,
            variables: { userId: selectedContact?._id, currentUserId: user?._id }
          },
          (data) => {
            if (!data) return data;
            return {
              ...data,
              fetchChats: {
                ...data.fetchChats,
                messages: [...data.fetchChats.messages, msg]
              }
            };
          }
        );
      } else {
        if (msg.sender?._id !== user?._id) {
          setUnreadMap((prev) => {
            const senderId = typeof msg?.sender?._id === 'string' ? msg.sender._id : '?';
            if (!senderId) return prev;

            const prevCount = prev[senderId]?.count || 0;

            return {
              ...prev,
              [senderId]: {
                count: prevCount + 1,
                lastMessage: msg.content || msg.lastMessage,
                timeStamp: msg.createdAt && typeof msg.createdAt === 'string' ? msg.createdAt : ''
              }
            };
          });
        }
      }
    });

    socket.on('newGroupMessage', (msg: Message) => {
      // const isSender = msg?.sender === authUser?._id;

      // If the user is in the current group chat
      if (selectedGroup && msg.groupId === selectedGroup._id) {
        setMessages((prev) => [...(prev as Message[]), msg]);

        //Update Apollo cache for FETCH_GROUP_MSGS
        try {
          const existing = client.readQuery<FetchGroupData>({
            query: FETCH_GROUP_MSGS,
            variables: { groupId: selectedGroup._id, limit: 30 }
          });

          if (existing?.fetchGroupMsgs?.messages) {
            client.writeQuery<FetchGroupData>({
              query: FETCH_GROUP_MSGS,
              variables: { groupId: selectedGroup._id, limit: 30 },
              data: {
                fetchGroupMsgs: {
                  ...existing.fetchGroupMsgs,
                  messages: [...existing.fetchGroupMsgs.messages, msg]
                }
              }
            });
          }
        } catch (err) {
          console.warn('Cache update skipped (no existing messages yet):', err);
        }
      } else {
        // If the message belongs to a different group, update unread counts
        if (msg.sender !== authUser?._id) {
          setUnreadMap((prev) => {
            const senderId = typeof msg?.sender === 'string' ? msg.sender : msg.receiverId;

            if (!senderId) return prev;

            const prevCount = prev[senderId]?.count || 0;

            return {
              ...prev,
              [senderId]: {
                count: prevCount + 1,
                lastMessage: msg.content || '',
                timeStamp: new Date().toISOString()
              }
            };
          });
        }
      }
    });

    socket.on('userOnline', ({ userId, online }) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
      setIsOnline(online);
    });

    socket.on('currentlyOnline', ({ userIds, online }) => {
      setOnlineUsers(new Set(userIds));
      setIsOnline(online);
    });

    socket.on('userOffline', ({ userId }) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        updated.delete(userId);
        return updated;
      });
    });

    socket.on('isConnected', ({ currentUser }) => {
      setOnlineUsers((prev) => new Set(prev).add(currentUser));
    });

    socket.on('typingIndication', ({ from }) => {
      setTypingUsers((prev) => new Set(prev).add(from));

      setTimeout(() => {
        setTypingUsers((prev) => {
          const updated = new Set(prev);
          updated.delete(from);
          return updated;
        });
      }, 2000);
    });

    return () => {
      socket.off('newMessage');
      socket.off('newGroupMessage');
      socket.off('userOnline');
      socket.off('userOffline');
      socket.off('isConnected');
      socket.off('typingIndication');
    };
  }, [
    selectedContact?._id,
    socket,
    user?._id,
    users,
    selectedChat,
    typingUsers,
    client,
    authUser?._id,
    selectedGroup
  ]); // ✅ Run only o

  const handleSelectedImage = (image: File | null) => {
    setSelectedImage(image);
  };

  const handleSelectChat = async (chatUser: AuthContextType | null) => {
    _setSelectedGroup(null);
    setSelectedContact(chatUser);
    // remove unread messages for this user
    setUnreadMap((prev) => {
      const updated = { ...prev };
      delete updated[typeof chatUser?._id === 'string' ? chatUser._id : '?'];
      return updated;
    });

    try {
      const { data } = await loadChats({
        variables: {
          userId: chatUser?._id,
          currentUserId: user?._id // from your auth context
        }
      });

      if (data?.fetchChats) {
        setMessages(data.fetchChats.messages);
        // setNotifiedUser(data.fetchChats.notifiedUser); // uncomment if needed
      }
    } catch (err) {
      console.error('Error fetching chat history:', err);
    }
  };

  const sendMessage = () => {
    if (socket && input?.trim() && selectedContact) {
      const payload = {
        content: input,
        receiverId: selectedContact?._id
      };

      // ✅ handle file upload
      if (selectedImage) {
        const file = selectedImage;
        const reader = new FileReader();

        reader.onload = () => {
          socket.emit('sendMessage', {
            ...payload,
            hasFile: true,
            file: {
              name: file.name,
              type: file.type,
              size: file.size,
              data: reader.result
            }
          });

          // Clear file after sending
          setSelectedImage(null);
        };

        reader.readAsArrayBuffer(file);
      } else {
        socket.emit('sendMessage', payload);
      }

      setInput('');
    }
  };

  const handleSendGroupChat = () => {
    if (socket && input?.trim() && selectedGroup) {
      const payload = {
        content: input,
        groupId: selectedGroup?._id,
        sender: authUser?._id
      };

      // ✅ handle file upload
      if (selectedImage) {
        const file = selectedImage;
        const reader = new FileReader();

        reader.onload = () => {
          socket.emit('sendGroupMessage', {
            ...payload,
            hasFile: true,
            file: {
              name: file.name,
              type: file.type,
              size: file.size,
              data: reader.result
            }
          });

          // Clear file after sending
          setSelectedImage(null);
        };

        reader.readAsArrayBuffer(file);
      } else {
        socket.emit('sendGroupMessage', payload);
      }

      setInput('');
    }
  };

  // // Send group messages from sender
  // const handleSendGroupChat = async () => {
  //   if (socket && input?.trim() && selectedGroup) {
  //     try {
  //       let base64File: unknown | string = null;

  //       if (selectedImage) {
  //         const reader = new FileReader();

  //         // Convert image to base64 string
  //         base64File = await new Promise((resolve, reject) => {
  //           reader.onload = () => resolve(reader.result);
  //           reader.onerror = reject;
  //           reader.readAsDataURL(selectedImage);
  //         });
  //       }

  //       const { data } = await sendGroupMessage({
  //         variables: {
  //           groupId: selectedGroup?._id as string,
  //           sender: authUser?._id as string,
  //           content: input,
  //           hasFile: !!selectedImage,
  //           file: selectedImage
  //             ? {
  //                 name: selectedImage.name,
  //                 type: selectedImage.type,
  //                 size: selectedImage.size,
  //                 data:
  //                   typeof base64File === 'string' && base64File !== null
  //                     ? base64File?.split(',')[1]
  //                     : '' // strip "data:image/png;base64,"
  //               }
  //             : null
  //         }
  //       });

  //       const newGroupMsg = data?.sendGroupMessage;
  //       if (!newGroupMsg) return;
  //       setMessages((prev) => [...(prev as Message[]), newGroupMsg]);
  //       setSelectedImage(null);
  //       setInput('');
  //     } catch (error) {
  //       console.error('Failed to send message:', error);
  //     }
  //   }
  // };

  const emitTyping = debounce((receiverId: string | unknown) => {
    if (socket && receiverId && user?._id) {
      socket.emit('typing', { receiverId });
    }
  }, 500);

  const handleTyping = (val: string) => {
    setInput(val);
    emitTyping(selectedContact?._id);
  };

  useEffect(() => {
    if (!socket || !user || !onlineUsers) return;

    onlineUsers.forEach((u) => {
      socket.emit('isOnline', { receiverId: u as string }); // receive user as id
    });
  }, [socket, user, onlineUsers]);

  const [chatCache, setChatCache] = useState<Record<string, { messages: Message[] }>>({});

  const handleSelectionTab = (selectedTab: TabTypes) => {
    setTab(selectedTab);
  };

  const handleSelectGroup = async (group: groupType) => {
    if (!group) return;
    setSelectedContact(null);
    _setSelectedChat(null);
    _setSelectedGroup(group);

    handleSelectionTab('groups');

    console.log('GROUPS SELECTED');

    // // ✅ Reset unread for this group
    // setUnreadMap((prev) => {
    //   const updated = { ...prev };
    //   delete updated[group._id];
    //   return updated;
    // });

    // // // ✅ Emit socket event to mark group as read
    // if (socket) {
    //   socket.emit('markGroupAsRead', { groupId: group._id, userId: currentUser._id });
    // }

    // ✅ 1. Show cached messages instantly if available
    if (chatCache && chatCache?.[group._id as string]) {
      setMessages(chatCache[group._id as string].messages);
      // setNotifiedUser(null); // groups don’t have a single “notified user”
    } else {
      setMessages([]); // placeholder while loading
    }

    // ✅ 2. Fetch latest group messages from server
    try {
      const { data } = await fetchGroupMsgs({
        variables: {
          groupId: group._id,
          limit: 30,
          cursor: null
        }
      });

      if (data?.fetchGroupMsgs) {
        const { messages } = data.fetchGroupMsgs;

        setMessages(messages);

        // Cache them for instant reload next time
        setChatCache((prev) => ({
          ...prev,
          [group._id as string]: { messages }
        }));
      }
    } catch (err) {
      console.error('❌ Error fetching group messages:', err);
    }
  };

  return (
    <Theme
      appearance={appTheme ? 'light' : 'dark'}
      radius="large"
      scaling="100%"
      accentColor="cyan"
      grayColor="slate"
      panelBackground="solid"
    >
      <Flex
        style={{
          height: '100vh',
          width: '100vw',
          overflow: 'hidden'
          // marginLeft: '-2%'
        }}
      >
        {/* IconBar */}
        <IconBar authUser={authUser} toggleTab={handleSelectionTab} />

        <SocketNotifications socketInstance={socket} />
        {isMobile ? (
          selectedContact || selectedGroup ? (
            // Show ChatBody full screen with back button
            <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Button
                variant="soft"
                style={{ alignSelf: 'flex-start', margin: '0.5rem' }}
                onClick={() => {
                  setSelectedContact(null);
                  _setSelectedGroup(null);
                }}
              >
                ← Back
              </Button>
              <ChatBody
                loadingChats={loadingChats}
                isMobile={isMobile}
                messages={messages}
                authUser={authUser}
                contact={selectedContact}
                handleSend={selectedContact ? sendMessage : handleSendGroupChat}
                handleGroupSend={handleSendGroupChat}
                input={input}
                handleInput={handleTyping} //{setInput}
                typingUsers={typingUsers}
                onlineUsers={onlineUsers}
                handleSelectedImage={handleSelectedImage}
                selectedImage={selectedImage}
              />
            </Box>
          ) : (
            // Show ContactBar full screen
            <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <ContactBar
                onlineUsers={onlineUsers}
                mockContacts={users}
                user={user}
                authUser={authUser}
                onSelectContact={handleSelectChat} //{setSelectedContact}
                onSelectGroup={handleSelectGroup} //{setSelectedContact}
                loading={contacts_loading}
                error={contacts_error}
                typingUsers={typingUsers}
                selectedContact={selectedContact ? selectedContact : selectedGroup}
                // selectedGroup={selectedGroup}
                tab={tab}
                groups={groups}
                loadingGroups={loadingGroups}
                loadingError={_errorLoading}
                unreadMap={unreadMap}
              />
            </Box>
          )
        ) : (
          <>
            {/* Contact List (desktop) */}
            <Box
              style={{
                minWidth: '350px',
                flex: '0 0 400px',
                borderRight: '1px solid var(--gray-a5)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <ContactBar
                mockContacts={users}
                user={user}
                authUser={authUser}
                onSelectContact={handleSelectChat}
                onSelectGroup={handleSelectGroup} //{setSelectedContact}
                loading={contacts_loading}
                error={contacts_error}
                typingUsers={typingUsers}
                onlineUsers={onlineUsers}
                // selectedContact={selectedContact}
                selectedContact={selectedContact ? selectedContact : selectedGroup}
                tab={tab}
                groups={groups}
                loadingGroups={loadingGroups}
                loadingError={_errorLoading}
                unreadMap={unreadMap}
              />
            </Box>

            {/* Chat Body */}
            <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <ChatBody
                loadingChats={loadingChats}
                isMobile={isMobile}
                messages={messages}
                authUser={authUser}
                contact={selectedContact ? selectedContact : selectedGroup}
                handleSend={selectedContact ? sendMessage : handleSendGroupChat}
                handleGroupSend={handleSendGroupChat}
                input={input}
                handleInput={handleTyping} //{setInput}
                typingUsers={typingUsers}
                onlineUsers={onlineUsers}
                handleSelectedImage={handleSelectedImage}
                selectedImage={selectedImage}
              />
            </Box>
          </>
        )}
      </Flex>
    </Theme>
  );
};

export default Home;
