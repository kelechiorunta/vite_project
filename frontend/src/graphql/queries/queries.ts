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
