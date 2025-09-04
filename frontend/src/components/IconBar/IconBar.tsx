// IconBar.tsx
import * as React from 'react';
import { Avatar, Button, Flex, IconButton, Tooltip } from '@radix-ui/themes';
import {
  ChatBubbleIcon,
  PersonIcon,
  GearIcon,
  HamburgerMenuIcon,
  ExitIcon,
  SunIcon,
  MoonIcon
} from '@radix-ui/react-icons';
import { useTheme } from '../theme-context';
import type { AuthContextType } from '../Home/Home';

interface IconBarProps {
  onOpenContacts?: () => void; // 👈 optional prop
  authUser: AuthContextType;
}

const IconBar: React.FC<IconBarProps> = ({ onOpenContacts, authUser }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  const { toggleTheme, appTheme } = useTheme();

  const handleLogout = () => {
    try {
      window.location.href = '/proxy/auth/logout';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex
      direction="column"
      justify="between"
      style={{
        width: collapsed ? '60px' : '80px',
        borderRight: '1px solid var(--gray-a5)',
        background: 'var(--gray-1)',
        transition: 'width 0.2s ease'
      }}
    >
      <Flex direction="column" align="center" gap="3" p="3">
        <Tooltip content="Me">
          <IconButton variant="ghost" size="3">
            <Avatar
              src={authUser.picture}
              fallback={
                typeof authUser?.username === 'string'
                  ? authUser?.username.charAt(0).toUpperCase()
                  : ''
              }
              radius="full"
              size="1"
            />
          </IconButton>
        </Tooltip>
        <IconButton variant="ghost" size="3" onClick={() => setCollapsed(!collapsed)}>
          <HamburgerMenuIcon />
        </IconButton>
        {onOpenContacts && (
          <Button variant="soft" onClick={onOpenContacts} style={{ marginBottom: '1rem' }}>
            ☰
          </Button>
        )}
        <Tooltip content="Chats">
          <IconButton variant="ghost" size="3">
            <ChatBubbleIcon />
          </IconButton>
        </Tooltip>
        <Tooltip content="Contacts">
          <IconButton variant="ghost" size="3">
            <PersonIcon />
          </IconButton>
        </Tooltip>
      </Flex>
      <Flex direction="column" align="center" gap="3" p="3">
        <Tooltip content="Settings">
          <IconButton variant="ghost" size="3">
            <GearIcon />
          </IconButton>
        </Tooltip>
      </Flex>
      <Flex direction="column" align="center" gap="3" p="3">
        <Tooltip content="Switch">
          <IconButton
            size="2"
            variant="soft"
            aria-label="Toggle theme"
            onClick={() => {
              toggleTheme(!appTheme);
            }}
          >
            {appTheme ? <SunIcon /> : <MoonIcon />}
          </IconButton>
        </Tooltip>
      </Flex>
      <Flex direction="column" align="center" gap="3" p="3">
        <Tooltip content="Logout">
          <IconButton onClick={handleLogout} variant="ghost" size="3">
            <ExitIcon />
          </IconButton>
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default IconBar;
