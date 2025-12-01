import { DropdownMenuIcon } from '@radix-ui/react-icons';
import { Button, DropdownMenu, IconButton, Text } from '@radix-ui/themes';
import type { AuthContextType, TabTypes } from '../Home/Home';
import AlertProfile from '../AlertProfile/AlertProfile';

interface MobileProps {
  onOpenContacts?: () => void; // 👈 optional prop
  authUser?: AuthContextType | null;
  toggleTab?: (tab: TabTypes) => void;
  handleProfileUpdate?: (props: AuthContextType) => void;
  handleLogout?: () => void;
  isCollapsible?: boolean;
  isMobile?: boolean;
}

export default function MobileDropDownMenu({
  toggleTab,
  authUser,
  handleProfileUpdate,
  handleLogout,
  isCollapsible
}: MobileProps) {
  const handleGroups = () => {
    if (toggleTab) {
      toggleTab('groups');
    }
  };
  const handleContacts = () => {
    if (toggleTab) {
      toggleTab('all');
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="soft">
          <DropdownMenuIcon />
          <DropdownMenu.TriggerIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {/* <DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>
        <DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item> */}

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>My Chats</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item onClick={handleContacts}>Contacts</DropdownMenu.Item>
            <DropdownMenu.Item onClick={handleGroups}>Groups</DropdownMenu.Item>

            <DropdownMenu.Separator />
            <DropdownMenu.Item
              onSelect={(e) => {
                e.preventDefault(); // <-- KEEP DROPDOWN OPEN
              }}
            >
              <AlertProfile
                component={<Text>Profile Settings...</Text>}
                isCollapsible={isCollapsible}
                user={authUser}
                handleProfileUpdate={handleProfileUpdate}
              />
            </DropdownMenu.Item>
            <DropdownMenu.Item>Advanced Settings...</DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>

        <DropdownMenu.Separator />
        <DropdownMenu.Item shortcut="⌘ ⌫" color="red">
          <IconButton
            style={{ display: 'flex', gap: '2' }}
            onClick={handleLogout}
            variant="ghost"
            size="3"
          >
            {/* <ExitIcon /> */}
            Logout
          </IconButton>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
