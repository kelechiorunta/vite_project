// // ChatBody.tsx
// import * as React from 'react';
// import { Flex, Text, TextField, IconButton, Avatar } from '@radix-ui/themes';
// import { PaperPlaneIcon } from '@radix-ui/react-icons';
// import { ChatHeader } from '../ChatHeader/ChatHeader';
// import type { AuthContextType, ChatMessage, Message } from '../Home/Home';
// import { useTheme } from '../theme-context';

// import TypingIndicator from '../Indicators/TypingIndicator';
// import ProgressiveImage from '../ProgressiveImage/ProgressiveImage';

// const ChatBody: React.FC<{
//   contact: AuthContextType | null;
//   authUser: AuthContextType;
//   messages: ChatMessage[] | Message[] | null;
//   isMobile: boolean;
//   loadingChats: boolean;
//   handleSend: () => void;
//   handleGroupSend: () => void;
//   input: string;
//   handleInput: (id: string) => void; //React.Dispatch<React.SetStateAction<string>>;
//   typingUsers: Set<string>;
//   onlineUsers: Set<string>;
// }> = ({
//   contact,
//   authUser,
//   messages,
//   isMobile,
//   // loadingChats,
//   handleSend,
//   input,
//   handleInput,
//   typingUsers,
//   onlineUsers
// }) => {
//   const chatEndRef = React.useRef<HTMLDivElement | null>(null);

//   const scrollToBottom = () => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   React.useEffect(scrollToBottom, [messages, typingUsers]);
//   const { appTheme } = useTheme();

//   return (
//     <Flex direction="column" style={{ flex: 1, background: 'var(--gray-1)' }}>
//       <ChatHeader onlineUsers={onlineUsers} typingUsers={typingUsers} contact={contact} />
//       {/* Messages */}
//       <Flex
//         className={appTheme ? 'chatBody_light' : 'chatBody_dark'}
//         direction="column"
//         style={{
//           flex: 1,
//           overflowY: 'scroll',
//           padding: '16px',
//           maxHeight: isMobile ? '75vh' : '82vh',
//           backgroundSize: 'cover',
//           backgroundPosition: 'center'
//         }}
//         gap="3"
//       >
//         {
//           //   loadingChats ? (
//           //   <div
//           //     style={{
//           //       display: 'flex',
//           //       // inset: 0,
//           //       justifyContent: 'center',
//           //       alignItems: 'center',
//           //       width: '100%',
//           //       minHeight: '60vh',
//           //       margin: 'auto',
//           //       color: !appTheme ? 'white' : 'black'
//           //       //   backgroundColor: 'rgba(0, 0, 0, 0.5)'
//           //     }}
//           //   >
//           //     <Spinner size={'3'} style={{ scale: 4.5 }} />
//           //   </div>
//           // ) :
//           messages &&
//             (messages as ChatMessage[] | Message[] | null)?.map((m) => (
//               <Flex
//                 key={typeof m._id === 'string' ? m._id : '?'}
//                 justify={
//                   (typeof m.sender === 'object' &&
//                     m.sender !== null &&
//                     '_id' in m.sender &&
//                     m.sender?._id === authUser?._id) ||
//                   m.sender === authUser?._id
//                     ? 'end'
//                     : 'start'
//                 }
//                 gapX={'2'}
//               >
//                 <Avatar
//                   src={
//                     typeof m.sender === 'object' &&
//                     m.sender !== null &&
//                     'picture' in m.sender &&
//                     m.sender?._id === authUser?._id
//                       ? m.sender?.picture
//                       : m.receiverAvatar === 'string' &&
//                           m.receiverAvatar !== null &&
//                           'receiverAvatar' in m
//                         ? m.receiverAvatar
//                         : m.senderAvatar
//                   }
//                   fallback={
//                     typeof m.sender === 'object' &&
//                     m.sender !== null &&
//                     'username' in m.sender &&
//                     typeof m.sender?.username === 'string'
//                       ? m.sender.username[0]
//                       : m.receiverName === 'string' &&
//                           m.receiverName !== null &&
//                           'receiverName' in m
//                         ? m.receiverName[0]
//                         : m.senderName !== undefined
//                           ? m.senderName[0]
//                           : '?'
//                   }
//                   radius="full"
//                   size="3"
//                 />
//                 <Text
//                   size="2"
//                   style={{
//                     padding: '8px 12px',
//                     borderRadius: '12px',
//                     background:
//                       (typeof m.sender === 'object' &&
//                         m.sender !== null &&
//                         '_id' in m.sender &&
//                         m.sender?._id === authUser?._id) ||
//                       m.sender === authUser?._id
//                         ? 'var(--cyan-5)'
//                         : 'var(--gray-4)',
//                     maxWidth: '70%'
//                   }}
//                 >
//                   {m.content}
//                   {m.hasImage && (
//                     <ProgressiveImage
//                       placeholderSrc={m?.placeholderUrl}
//                       src={m?.imageUrl}
//                       alt="attachment"
//                       style={{
//                         maxWidth: '200px',
//                         maxHeight: '200px',
//                         borderRadius: '8px',
//                         marginTop: '4px'
//                       }}
//                     />
//                   )}
//                   {<div ref={chatEndRef} />}
//                 </Text>
//               </Flex>
//             ))
//         }
//         {[...typingUsers].length > 0 && typingUsers.has(contact?._id as string) && (
//           <div ref={chatEndRef} className="typing-container">
//             <Avatar
//               src={contact?.picture}
//               fallback={typeof contact?.username === 'string' ? contact.username[0] : '?'}
//               radius="full"
//               size="3"
//             />
//             <div className="typing-bubble">
//               <TypingIndicator />
//             </div>
//           </div>
//         )}
//         {/* {!isMobile && <div ref={chatEndRef} />} */}
//       </Flex>

//       {/* Input */}
//       <Flex p="3" gap="2" align="center" style={{ borderTop: '1px solid var(--gray-a5)' }}>
//         <TextField.Root
//           placeholder="Type a message..."
//           value={input}
//           onChange={(e) => handleInput(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter' && !e.shiftKey) {
//               e.preventDefault(); // prevent newline
//               handleSend();
//             }
//           }}
//           style={{ flex: 1 }}
//         />
//         <IconButton size="3" onClick={handleSend}>
//           <PaperPlaneIcon />
//         </IconButton>
//       </Flex>
//     </Flex>
//   );
// };

// export default ChatBody;

import * as React from 'react';
import { Flex, Text, TextField, IconButton, Avatar, Card } from '@radix-ui/themes';
import { PaperPlaneIcon, ImageIcon, Cross2Icon } from '@radix-ui/react-icons'; // ✅ import ImageIcon
import { ChatHeader } from '../ChatHeader/ChatHeader';
import type { AuthContextType, ChatMessage, Message } from '../Home/Home';
import { useTheme } from '../theme-context';
import TypingIndicator from '../Indicators/TypingIndicator';
import ProgressiveImage from '../ProgressiveImage/ProgressiveImage';

const ChatBody: React.FC<{
  contact: AuthContextType | null;
  authUser: AuthContextType;
  messages: ChatMessage[] | Message[] | null;
  isMobile: boolean;
  loadingChats: boolean;
  handleSend: () => void;
  handleGroupSend: () => void;
  handleSelectedImage: (image: File | null) => void;
  selectedImage: File | null;
  input: string;
  handleInput: (id: string) => void;
  typingUsers: Set<string>;
  onlineUsers: Set<string>;
}> = ({
  contact,
  authUser,
  messages,
  isMobile,
  handleSend,
  input,
  handleInput,
  typingUsers,
  onlineUsers,
  handleSelectedImage,
  selectedImage
}) => {
  const chatEndRef = React.useRef<HTMLDivElement | null>(null);

  const { appTheme } = useTheme();

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  React.useEffect(scrollToBottom, [messages, typingUsers]);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  // ✅ Create preview whenever a new file is selected
  React.useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedImage]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleSelectedImage(file);
      console.log('📸 Selected image:', file.name);
      // console.log(_previewUrl);
      // You can show a preview or immediately send it
    }
  };

  const handleRemoveImage = () => {
    handleSelectedImage(null);
    setPreviewUrl(null);
  };

  return (
    <Flex direction="column" style={{ flex: 1, background: 'var(--gray-1)' }}>
      <ChatHeader onlineUsers={onlineUsers} typingUsers={typingUsers} contact={contact} />

      {/* Messages */}
      <Flex
        className={appTheme ? 'chatBody_light' : 'chatBody_dark'}
        direction="column"
        style={{
          flex: 1,
          overflowY: 'scroll',
          padding: '16px',
          maxHeight: isMobile ? '75vh' : '82vh',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        gap="3"
      >
        {messages &&
          messages.map((m) => (
            <Flex
              key={typeof m._id === 'string' ? m._id : '?'}
              justify={
                (typeof m.sender === 'object' &&
                  m.sender !== null &&
                  '_id' in m.sender &&
                  m.sender?._id === authUser?._id) ||
                m.sender === authUser?._id
                  ? 'end'
                  : 'start'
              }
              gapX={'2'}
            >
              <Avatar
                src={
                  typeof m.sender === 'object' &&
                  m.sender !== null &&
                  'picture' in m.sender &&
                  m.sender?._id === authUser?._id
                    ? m.sender?.picture
                    : typeof m.receiverAvatar === 'object' && m.receiverAvatar !== null
                      ? m.receiverAvatar
                      : m.senderAvatar
                }
                fallback={
                  typeof m.sender === 'object' &&
                  m.sender !== null &&
                  'username' in m.sender &&
                  typeof m.sender?.username === 'string'
                    ? m.sender.username[0]
                    : m.senderName !== null && typeof m.senderName === 'string'
                      ? m.senderName[0]
                      : '?'
                }
                radius="full"
                size="3"
              />
              <Text
                size="2"
                style={{
                  padding: '8px 12px',
                  borderRadius: '12px',
                  background:
                    (typeof m.sender === 'object' &&
                      m.sender !== null &&
                      '_id' in m.sender &&
                      m.sender?._id === authUser?._id) ||
                    m.sender === authUser?._id
                      ? 'var(--cyan-5)'
                      : 'var(--gray-4)',
                  maxWidth: '70%'
                }}
              >
                {m.content}
                {m.hasImage && (
                  <ProgressiveImage
                    placeholderSrc={m?.placeholderUrl}
                    src={m?.imageUrl}
                    alt="attachment"
                    style={{
                      maxWidth: '200px',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      marginTop: '4px'
                    }}
                  />
                )}
                <div ref={chatEndRef} />
              </Text>
            </Flex>
          ))}

        {[...typingUsers].length > 0 && typingUsers.has(contact?._id as string) && (
          <div ref={chatEndRef} className="typing-container">
            <Avatar
              src={contact?.picture}
              fallback={typeof contact?.username === 'string' ? contact.username[0] : '?'}
              radius="full"
              size="3"
            />
            <div className="typing-bubble">
              <TypingIndicator />
            </div>
          </div>
        )}
      </Flex>

      {previewUrl && (
        <Flex
          justify="start"
          align="center"
          gap="3"
          p="2"
          style={{
            borderTop: '1px solid var(--gray-a4)',
            background: 'var(--gray-2)',
            position: 'absolute',
            bottom: 70
            // left: 100
          }}
        >
          <Card
            style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              width: '100px',
              height: '100px'
            }}
          >
            <img
              src={previewUrl}
              alt="Selected preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <IconButton
              color="red"
              size="1"
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.7)'
              }}
              onClick={handleRemoveImage}
            >
              <Cross2Icon />
            </IconButton>
          </Card>
        </Flex>
      )}

      {/* ✅ Input with Image Attach */}
      <Flex p="3" gap="2" align="center" style={{ borderTop: '1px solid var(--gray-a5)' }}>
        {/* hidden file input */}
        <input
          type="file"
          accept="image/*"
          id="imageUpload"
          style={{ display: 'none' }}
          onChange={handleImageSelect}
        />
        <label htmlFor="imageUpload">
          <IconButton size="3" variant="soft" color="gray" asChild>
            <ImageIcon style={{ cursor: 'pointer' }} />
          </IconButton>
        </label>

        <TextField.Root
          placeholder="Type a message..."
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          style={{ flex: 1 }}
        />
        <IconButton size="3" onClick={handleSend}>
          <PaperPlaneIcon />
        </IconButton>
      </Flex>
    </Flex>
  );
};

export default ChatBody;
