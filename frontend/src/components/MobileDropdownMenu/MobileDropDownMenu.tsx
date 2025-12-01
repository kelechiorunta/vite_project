import { DropdownMenuIcon } from '@radix-ui/react-icons';
import { Button, DropdownMenu, IconButton } from '@radix-ui/themes';
import type { AuthContextType, TabTypes } from '../Home/Home';

interface MobileProps {
  onOpenContacts?: () => void; // 👈 optional prop
  authUser?: AuthContextType | null;
  toggleTab?: (tab: TabTypes) => void;
  handleProfileUpdate?: (props: AuthContextType) => void;
  isCollapsible?: boolean;
  isMobile?: boolean;
}

export default function MobileDropDownMenu({ toggleTab }: MobileProps) {
  const handleLogout = () => {
    try {
      window.location.href = '/proxy/auth/logout';
    } catch (error) {
      console.error(error);
    }
  };
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
        <DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>
        <DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>Groups</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item onClick={handleContacts}>Contacts</DropdownMenu.Item>
            <DropdownMenu.Item onClick={handleGroups}>Groups</DropdownMenu.Item>

            <DropdownMenu.Separator />
            <DropdownMenu.Item>Profile Settings...</DropdownMenu.Item>
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
