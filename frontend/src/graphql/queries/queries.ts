import { gql } from '@apollo/client';
export const GET_CONTACTS = gql`
  query GetContacts {
    users {
      _id
      email
      username
      picture
      lastMessage
      lastMessageCount
      isOnline
      unread {
        sender {
          _id
          username
          picture
        }
        count
        lastMessage
        updatedAt
      }
    }
  }
`;

export const AUTH = gql`
  query authenticatedUser {
    auth {
      _id
      email
      username
      picture
      address
      phone
      birthday
      gender
      lastMessage
      lastMessageCount
      isOnline
      unread {
        sender {
          _id
          username
          picture
        }
        count
        lastMessage
        updatedAt
      }
    }
  }
`;

export const FETCH_CHATS = gql`
  query FetchChats($userId: ID!, $currentUserId: ID!) {
    fetchChats(userId: $userId, currentUserId: $currentUserId) {
      messages {
        _id
        content
        createdAt
        updatedAt
        imageUrl
        imageFileId
        placeholderImgId
        placeholderUrl
        hasImage
        sender {
          _id
          username
          picture
        }
        receiver {
          _id
          username
        }
      }
      notifiedUser {
        _id
        username
      }
    }
  }
`;

export const FETCH_GROUPS = gql`
  query FetchGroups {
    fetchGroups {
      _id
      name
      description
      logo
      username
      picture
      createdAt
      members {
        _id
        username
        picture
      }
    }
  }
`;

export const FETCH_GROUP_MSGS = gql`
  query FetchGroupMsgs($groupId: ID!, $limit: Int, $cursor: String) {
    fetchGroupMsgs(groupId: $groupId, limit: $limit, cursor: $cursor) {
      messages {
        _id
        content
        sender
        receiver
        senderName
        receiverName
        senderAvatar
        receiverAvatar
        createdAt
        imageUrl
        placeholderUrl
        hasImage
      }
    }
  }
`;

export const GET_UNREAD = gql`
  query GetUnread($senderIds: [ID!], $recipientId: ID!) {
    getUnread(senderIds: $senderIds, recipientId: $recipientId) {
      senderId
      count
      lastMessage
      createdAt
      updatedAt
    }
  }
`;

// ✅ 2. Mutation: Send group message
export const SEND_GROUP_MESSAGE = gql`
  mutation SendGroupMessage(
    $groupId: ID!
    $sender: ID!
    $content: String!
    $hasFile: Boolean
    $file: FileInput
  ) {
    sendGroupMessage(
      groupId: $groupId
      sender: $sender
      content: $content
      hasFile: $hasFile
      file: $file
    ) {
      _id
      content
      sender
      senderName
      senderAvatar
      createdAt
      hasImage
      imageFileId
      placeholderImgId
      imageUrl
      placeholderUrl
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      success
      message
      user {
        _id
        username
        email
        gender
        phone
        address
        picture
        birthday
      }
    }
  }
`;

export const MARK_MESSAGES_AS_READ = gql`
  mutation MarkMessagesAsRead($senderId: ID!) {
    markMessagesAsRead(senderId: $senderId)
  }
`;

export const CREATE_UNREAD = gql`
  mutation CreateUnread($senderId: ID!, $recipientId: ID!, $newMessage: String!) {
    createUnread(senderId: $senderId, recipientId: $recipientId, newMessage: $newMessage) {
      count
      lastMessage
    }
  }
`;

export const CLEAR_UNREAD = gql`
  mutation ClearUnread($senderId: ID!, $recipientId: ID!) {
    clearUnread(senderId: $senderId, recipientId: $recipientId)
  }
`;
