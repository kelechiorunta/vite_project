import * as React from 'react';
import { Avatar, Badge, Text, Flex, Box, Button } from '@radix-ui/themes';
import type { AuthContextType } from '../Home/Home';

// Types
export type Contact = {
  id: string;
  name: string;
  lastMessage: string;
  time: string; // format HH:mm for demo
  unread?: number;
  isOnline?: boolean;
  isTyping?: boolean;
};

// Chat Header (to be used inside ChatBody)
export const ChatHeader: React.FC<{
  contact?: AuthContextType | null;
  onBack?: () => void; // useful for mobile switcher
  typingUsers?: Set<string>;
  onlineUsers?: Set<string>;
}> = ({ contact, onBack, typingUsers, onlineUsers }) => {
  const isTyping = typingUsers?.has(contact?._id as string);
  const isOnline = onlineUsers?.has(contact?._id as string);
  return (
    <Flex
      align="center"
      justify="between"
      px="3"
      py="2"
      style={{ borderBottom: '1px solid var(--gray-a3)' }}
    >
      <Flex align="center" gap="3">
        {onBack ? (
          <Button variant="ghost" size="1" onClick={onBack}>
            ←
          </Button>
        ) : null}

        <Avatar
          src={typeof contact?.picture === 'string' ? contact.picture : undefined}
          fallback={typeof contact?.username === 'string' ? contact.username[0] : '?'}
          radius="full"
          size="3"
        />
        <Box>
          <Flex direction={'column'} align="start" gap="1">
            <Text weight="medium">{contact ? contact.username : 'Select a contact'}</Text>
            {isOnline ? (
              <>
                <Badge color="green">Online</Badge>
                <Text size="1" color={isTyping ? 'green' : 'gray'}>
                  {isTyping ? 'typing...' : (contact?.lastMessage ?? '')}
                </Text>
              </>
            ) : (
              <Badge color="gray">Offline</Badge>
            )}
          </Flex>
          {/* <Text size="1" color="gray">
            {isTyping ? 'typing...' : (contact?.lastMessage ?? '')}
          </Text> */}
        </Box>
      </Flex>
    </Flex>
  );
};
