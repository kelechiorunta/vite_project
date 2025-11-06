// ContactBar.tsx
import * as React from 'react';
import { Flex, Avatar, Text, Badge, Box, Select, TextField, Heading } from '@radix-ui/themes';
import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import type { AuthContextType, groupType, TabTypes, UnreadMap } from '../Home/Home';

import './ContactBar.css';
import { useTheme } from '../theme-context';
import { formatDateLabel, parseTimeToMinutes } from '../helper/helper';

export type Contact = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  isOnline?: boolean;
  isTyping?: boolean;
};

// // Helpers
// const parseTimeToMinutes = (t: string | unknown) => {
//   if (typeof t === 'string') {
//     const [h, m] = t.split(' ').map(Number);
//     if (!isNaN(h) && !isNaN(m)) {
//       return h * 60 + m;
//     }
//   }
//   return 0; // fallback for invalid input
// };

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`skeleton ${className || ''}`} />
);

const ContactBar: React.FC<{
  onSelectContact: (id: AuthContextType) => void;
  onSelectGroup?: (group: groupType) => void;
  authUser: AuthContextType;
  selectedContact: AuthContextType | null;
  selectedGroup?: groupType | null;
  user: undefined | AuthContextType;
  mockContacts: AuthContextType[] | undefined;
  loading: boolean;
  error: unknown;
  typingUsers: Set<string>;
  onlineUsers: Set<string>;
  unreadMap: UnreadMap;
  tab?: TabTypes;
  groups?: groupType[];
  loadingGroups?: boolean;
  loadingError?: unknown;
}> = ({
  onSelectContact,
  onSelectGroup,
  mockContacts,
  authUser,
  loading,
  error,
  typingUsers,
  onlineUsers,
  selectedContact,
  unreadMap,
  tab,
  groups,
  loadingGroups,
  loadingError
}) => {
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState<'all' | 'unread' | 'online' | string>('all');
  const [sort, setSort] = React.useState<'newest' | 'oldest' | string>('newest');
  const [no, setNo] = React.useState<number | null>(null);
  const { appTheme } = useTheme();

  const filtered: AuthContextType[] | undefined = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = mockContacts?.slice();

    if (q) {
      list = list?.filter(
        (c) => c.username?.toLowerCase().includes(q) || c.lastMessage?.toLowerCase().includes(q)
      );
    }

    if (filter === 'unread') {
      list = list?.filter((c) => {
        const unReadData = unreadMap[c?._id as string];
        return unReadData && unReadData?.count > 0;
      });
    }
    if (filter === 'online') {
      list = list?.filter((c) => onlineUsers && onlineUsers.has(c?._id as string));
    }

    list?.sort((a, b) => {
      const unReadDataA = unreadMap[a?._id as string];
      const unReadDataB = unreadMap[b?._id as string];
      const aMin = parseTimeToMinutes(unReadDataA?.timeStamp);
      const bMin = parseTimeToMinutes(unReadDataB?.timeStamp);
      return sort === 'newest' ? bMin - aMin : aMin - bMin;
    });
    // setFilteredUsers(list);
    return list;
  }, [query, mockContacts, filter, unreadMap, onlineUsers, sort]);

  const [allFilteredUsers, setFilteredUsers] = React.useState<
    (AuthContextType | groupType)[] | undefined
  >(tab === 'all' ? filtered : groups);

  React.useEffect(() => {
    if (tab === 'all') {
      setFilteredUsers(filtered);
    } else if (tab === 'groups') {
      setFilteredUsers(groups);
    } else {
      setFilteredUsers(groups);
    }
  }, [tab, filtered, groups]);

  React.useEffect(() => {
    const online = filtered && filtered.filter((user) => onlineUsers.has(user._id as string));
    const offline = filtered && filtered.filter((user) => !onlineUsers.has(user._id as string));

    if (online && offline && tab === 'all') {
      const sortedUsers = [
        ...online.sort((a: AuthContextType, b: AuthContextType) => {
          // Handle null/undefined cases defensively
          if (!a && !b) return 0;
          if (!a) return 1;
          if (!b) return -1;

          // Coerce boolean to number (true = 1, false = 0)
          return Number(b.isOnline) - Number(a.isOnline);
        }),
        ...offline
      ];

      setFilteredUsers(sortedUsers);
    }
  }, [onlineUsers, filtered, tab]);
  return (
    <Flex direction="column" style={{ flex: 1, height: '100%' }}>
      {/* Header: Messages + Filters */}
      <Flex
        align="center"
        justify="between"
        px="3"
        py="3"
        style={{ borderBottom: '1px solid var(--gray-a3)' }}
      >
        <Box>
          <Heading weight="bold">{'Messages'}</Heading>
          {/* <Text size="1" color="gray">
            {mockContacts.length} chats
          </Text> */}
        </Box>

        <Flex gap="2">
          <Select.Root value={filter} onValueChange={(v) => setFilter(v)}>
            <Select.Trigger variant="soft" />
            <Select.Content>
              <Select.Item value="all">All</Select.Item>
              <Select.Item value="unread">Unread</Select.Item>
              <Select.Item value="online">Online</Select.Item>
            </Select.Content>
          </Select.Root>

          <Select.Root value={sort} onValueChange={(v) => setSort(v)}>
            <Select.Trigger variant="soft" />
            <Select.Content>
              <Select.Item value="newest">Newest</Select.Item>
              <Select.Item value="oldest">Oldest</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>

      {/* Search */}
      <Box px="3" py="2" style={{ borderBottom: '1px solid var(--gray-a3)' }}>
        <TextField.Root
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search or start a new chat"
        />
      </Box>

      {/* Contact list */}
      <Box style={{ flex: 1, overflowY: 'auto' }}>
        {loading || loadingGroups ? (
          Array.from({
            length: typeof mockContacts?.length === 'number' ? mockContacts.length - 1 : 18
          }).map((_, idx) => (
            <div key={idx} className="skeleton-card">
              {/* Avatar skeleton */}
              <AspectRatio.Root ratio={9} className="avatar-wrapper">
                <Skeleton className="avatar" />
              </AspectRatio.Root>

              {/* Contact info skeleton */}
              <div className="skeleton-info">
                <Skeleton className="line line-username" />
                <Skeleton className="line line-subtitle" />
              </div>

              {/* Timestamp skeleton */}
              <Skeleton className="line line-timestamp" />
            </div>
          ))
        ) : error || loadingError ? (
          <div className="text-danger">Error fetching contacts</div>
        ) : allFilteredUsers && allFilteredUsers?.length === 0 ? (
          <Box p="3">
            <Text size="2" color="gray">
              No chats found
            </Text>
          </Box>
        ) : (
          allFilteredUsers &&
          allFilteredUsers?.map((c, idx) => {
            const isTyping = typingUsers && typingUsers.has(c?._id as string);
            const isOnline = onlineUsers && onlineUsers.has(c?._id as string);
            console.log(unreadMap[c?._id as string]);
            const unReadData = unreadMap[c?._id as string];

            const isGroupLeader =
            tab === "groups" &&
            c &&
            typeof c === "object" &&
            Array.isArray(c.members) &&
            c.members[0]?.username === authUser?.username;
          
            console.log(formatDateLabel(unReadData?.timeStamp));
            return (
              <Flex
                key={typeof c._id === 'string' ? c._id : '?'}
                align="center"
                justify="between"
                p="3"
                style={{
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--gray-a3)',
                  backgroundColor:
                    c?._id == allFilteredUsers[no as number]?._id
                      ? appTheme
                        ? 'rgba(0,0,0,0.1)'
                        : 'rgba(255, 255, 255, 0.1)'
                      : 'transparent'
                }}
                onClick={() => {
                  if (tab === 'all' && onSelectContact) {
                    onSelectContact(c);
                  } else {
                    if (onSelectGroup) onSelectGroup(c as groupType);
                  }
                  setNo(idx);
                  console.log(c);
                  console.log(selectedContact);
                  console.log(allFilteredUsers[idx]._id);
                }}
              >
                <Flex gap="3" align="center">
                  <div style={{ position: 'relative' }}>
                    <Avatar
                      src={
                        typeof c.picture === 'string' && c.picture
                          ? c.picture
                          : c.logo
                            ? `/proxy/chat-pictures/logo/${c.logo.toString()}`
                            : undefined
                      }
                      fallback={
                        c.username
                          ? c.username.charAt(0).toUpperCase()
                          : c.name
                            ? c.name.charAt(0).toUpperCase()
                            : '?'
                      }
                      radius="full"
                      size="3"
                    />
                    {isOnline ? (
                      <Badge
                        style={{ position: 'absolute', bottom: -4, right: -9, zIndex: 10 }}
                        color="grass"
                      >
                        ●
                      </Badge>
                    ) : (
                      <Badge
                        style={{
                          position: 'absolute',
                          bottom: -4,
                          right: -9,
                          zIndex: 10,
                          color: !appTheme ? 'gray' : 'white'
                        }}
                        // color={appTheme && 'gray'}
                      >
                        ●
                      </Badge>
                    )}
                  </div>

                  <Box
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                  >
                    <Flex
                      className="responsive-flex"
                      align="center"
                      gap="2"
                    >
                      <Text truncate weight="medium">
                        {tab === 'all' && c.username
                          ? c.username
                          : tab === 'groups' && c.name
                            ? c.name
                            : c.username}
                      </Text>
                    </Flex>
                    <Text
                      className="responsive-flex-text"
                      truncate
                      size="1"
                      color={isTyping ? 'green' : 'gray'}
                      style={{
                        textAlign: 'left',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block',
                        maxWidth: '150px'
                      }}
                    >
                      {isTyping
                        ? 'typing...'
                        : unReadData
                          ? unReadData?.lastMessage || 'No messages'
                          : typeof c.members === 'object' && c.members !== null && 'members' in c
                            ? `${c?.members?.length.toString()} members`
                            : 'No messages'}
                    </Text>
                  </Box>
                </Flex>
                <Flex className="responsive-flex" direction="column" align="end" gap="1">
                  <Text className="responsive-flex-text" truncate size="1" color="gray">
                    {unReadData && unReadData.timeStamp
                      ? formatDateLabel(unReadData.timeStamp)
                      : unReadData?.timeStamp}
                      {isGroupLeader && 'Group lead'}
                  </Text>
                  {unReadData ? (
                    <Badge color="cyan">
                      {unReadData.count ? unReadData.count : 'No messages'}
                    </Badge>
                  ) : null}
                </Flex>
              </Flex>
            );
          })
        )}
      </Box>
    </Flex>
  );
};

export default ContactBar;
