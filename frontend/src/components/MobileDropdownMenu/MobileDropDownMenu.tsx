import { DropdownMenuIcon } from '@radix-ui/react-icons';
import { Button, DropdownMenu, IconButton } from '@radix-ui/themes';

export default function MobileDropDownMenu() {
  const handleLogout = () => {
    try {
      window.location.href = '/proxy/auth/logout';
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <DropdownMenu.Root >
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
            <DropdownMenu.Item>Contacts</DropdownMenu.Item>
            <DropdownMenu.Item>Groups</DropdownMenu.Item>

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
