// IconBar.tsx
import * as React from 'react';
import { Avatar, Button, Flex, IconButton, Tooltip } from '@radix-ui/themes';
import {
  ChatBubbleIcon,
  PersonIcon,
  GroupIcon,
  GearIcon,
  HamburgerMenuIcon,
  ExitIcon,
  SunIcon,
  MoonIcon
} from '@radix-ui/react-icons';
import { useTheme } from '../theme-context';
import type { AuthContextType, TabTypes } from '../Home/Home';
import AlertProfile from '../AlertProfile/AlertProfile';

interface IconBarProps {
  onOpenContacts?: () => void; // 👈 optional prop
  authUser: AuthContextType | null;
  toggleTab?: (tab: TabTypes) => void;
  handleProfileUpdate?: (props: AuthContextType) => void;
}

const IconBar: React.FC<IconBarProps> = ({
  onOpenContacts,
  authUser,
  toggleTab,
  handleProfileUpdate
}) => {
  const [collapsed, setCollapsed] = React.useState(true);

  const { toggleTheme, appTheme } = useTheme();

  const handleLogout = () => {
    try {
      window.location.href = '/proxy/auth/logout';
    } catch (error) {
      console.error(error);
    }
  };

  // function handleProfileUpdate(props: AuthContextType): void {
  //   throw new Error('Function not implemented.');
  // }

  const [isCollapsible, setIsCollapsible] = React.useState(window.innerWidth < 400);

  // 🔥 Watch window resize and update `isMobile`
  React.useEffect(() => {
    const handleResize = () => {
      setIsCollapsible(window.innerWidth < 400);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isCollapsible]);

  return (
    <>
      {isCollapsible ? (
        <Button>Hello</Button>
      ) : (
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
            <Tooltip content="Me" side="right">
              <IconButton variant="ghost" size="3">
                <Avatar
                  src={authUser?.picture}
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
            <Tooltip content="Chats" side="right">
              <IconButton variant="ghost" size="3">
                <ChatBubbleIcon />
              </IconButton>
            </Tooltip>
            <Tooltip content="Contacts" side="right">
              <IconButton
                onClick={() => {
                  if (toggleTab) toggleTab('all');
                }}
                variant="ghost"
                size="3"
              >
                <PersonIcon />
              </IconButton>
            </Tooltip>
            <Tooltip content="Groups" side="right">
              <IconButton
                onClick={() => {
                  if (toggleTab) {
                    toggleTab('groups');
                    // alert('Groups');
                  }
                }}
                variant="ghost"
                size="3"
              >
                <GroupIcon />
              </IconButton>
            </Tooltip>
          </Flex>
          <Flex direction="column" align="center" gap="3" p="3">
            <Tooltip content="Settings" side="right">
              <AlertProfile
                component={
                  <IconButton variant="ghost" size="3">
                    <GearIcon />
                  </IconButton>
                }
                user={authUser}
                handleProfileUpdate={handleProfileUpdate}
              />
            </Tooltip>
          </Flex>
          <Flex direction="column" align="center" gap="3" p="3">
            <Tooltip content="Switch" side="right">
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
            <Tooltip content="Logout" side="right">
              <IconButton onClick={handleLogout} variant="ghost" size="3">
                <ExitIcon />
              </IconButton>
            </Tooltip>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default IconBar;
