// ChatBody.tsx
import * as React from 'react';
import { Flex, Text, TextField, IconButton, Avatar } from '@radix-ui/themes';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
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
  input: string;
  handleInput: (id: string) => void; //React.Dispatch<React.SetStateAction<string>>;
  typingUsers: Set<string>;
  onlineUsers: Set<string>;
}> = ({
  contact,
  authUser,
  messages,
  isMobile,
  // loadingChats,
  handleSend,
  input,
  handleInput,
  typingUsers,
  onlineUsers
}) => {
  const chatEndRef = React.useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(scrollToBottom, [messages, typingUsers]);
  const { appTheme } = useTheme();

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
        {
          //   loadingChats ? (
          //   <div
          //     style={{
          //       display: 'flex',
          //       // inset: 0,
          //       justifyContent: 'center',
          //       alignItems: 'center',
          //       width: '100%',
          //       minHeight: '60vh',
          //       margin: 'auto',
          //       color: !appTheme ? 'white' : 'black'
          //       //   backgroundColor: 'rgba(0, 0, 0, 0.5)'
          //     }}
          //   >
          //     <Spinner size={'3'} style={{ scale: 4.5 }} />
          //   </div>
          // ) :
          messages &&
            (messages as ChatMessage[] | Message[] | null)?.map((m) => (
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
                      : m.receiverAvatar === 'string' &&
                          m.receiverAvatar !== null &&
                          'receiverAvatar' in m
                        ? m.receiverAvatar
                        : m.senderAvatar
                  }
                  fallback={
                    typeof m.sender === 'object' &&
                    m.sender !== null &&
                    'username' in m.sender &&
                    typeof m.sender?.username === 'string'
                      ? m.sender.username[0]
                      : m.receiverName === 'string' &&
                          m.receiverName !== null &&
                          'receiverName' in m
                        ? m.receiverName[0]
                        : m.senderName !== undefined
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
                  {<div ref={chatEndRef} />}
                </Text>
              </Flex>
            ))
        }
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
        {/* {!isMobile && <div ref={chatEndRef} />} */}
      </Flex>

      {/* Input */}
      <Flex p="3" gap="2" align="center" style={{ borderTop: '1px solid var(--gray-a5)' }}>
        <TextField.Root
          placeholder="Type a message..."
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault(); // prevent newline
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
