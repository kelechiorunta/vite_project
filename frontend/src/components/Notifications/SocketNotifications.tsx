// SocketNotifications.tsx
import { useEffect, useRef, useState } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { GET_CONTACTS } from '../../graphql/queries/queries';
import { toast, ToastContainer, type Id } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as RadixToast from '@radix-ui/react-toast';
import { Socket } from 'socket.io-client';
import type { AuthContextType } from '../Home/Home';

type User = AuthContextType | undefined;

type SocketEventPayload = {
  status?: string;
  loggedInUser?: User;
  signedOutUser?: User;
  updatedUser?: User;
};

interface SocketNotificationsProps {
  socketInstance: Socket | null;
  handleUpdating?: (update: AuthContextType | null) => void;
}

/**
 * Combined login/logout/profile notifications from socket events
 */
const SocketNotifications: React.FC<SocketNotificationsProps> = ({
  socketInstance,
  handleUpdating
}) => {
  const [_signedUsers, setSignedUsers] = useState<Set<string>>(new Set());
  const [_updatedProfileUser, setUpdatedProfileUser] = useState<User | null>(null);
  const recentlyUpdatedProfilesRef = useRef<Set<string>>(new Set());
  const loginToastRef = useRef<Id | null>(null);
  const client = useApolloClient();

  useEffect(() => {
    if (!socketInstance) return;

    const handleLoggingIn = ({ status, loggedInUser }: SocketEventPayload) => {
      if (status === 'ok' && loggedInUser?._id) {
        setSignedUsers((prev) => {
          if (recentlyUpdatedProfilesRef.current.has(loggedInUser._id as string)) {
            return prev;
          }
          if (!prev.has(loggedInUser._id as string)) {
            const newSet = new Set(prev);
            newSet.add(loggedInUser._id as string);

            if (!toast.isActive(loginToastRef.current as Id)) {
              loginToastRef.current = toast.success(`🎉 ${loggedInUser.username} just joined in!`, {
                position: 'top-right',
                autoClose: 4000,
                pauseOnHover: true,
                draggable: true
              });
            }

            return newSet;
          }
          return prev;
        });
      }
    };

    const handleSigningIn = ({ loggedInUser }: SocketEventPayload) => {
      if (loggedInUser?._id) {
        toast.success(`👋 ${loggedInUser.username} signed in!`, {
          position: 'top-right',
          autoClose: 4000,
          pauseOnHover: true,
          draggable: true
        });
      }
    };

    const handleLoggingOut = ({ signedOutUser }: SocketEventPayload) => {
      if (signedOutUser?._id) {
        toast.info(`👋 ${signedOutUser.username} logged out!`, {
          position: 'top-right',
          autoClose: 4000,
          pauseOnHover: true,
          draggable: true
        });
      }
    };

    const handleProfileChanged = ({ updatedUser }: SocketEventPayload) => {
      try {
        if (!updatedUser) return;

        const existing = client.readQuery<{ users: User[] }>({ query: GET_CONTACTS });
        if (existing) {
          const updatedUsers = existing.users.map((user: User) =>
            user?._id === updatedUser._id ? { ...user, ...updatedUser } : user
          );
          client.writeQuery({
            query: GET_CONTACTS,
            data: { users: updatedUsers }
          });
        }

        // track to avoid login toast

        if (handleUpdating) {
          handleUpdating(updatedUser);
          setUpdatedProfileUser(updatedUser);
        }
        console.log('Updating');
        recentlyUpdatedProfilesRef.current.add(updatedUser._id as string);
        setTimeout(() => {
          recentlyUpdatedProfilesRef.current.delete(updatedUser._id as string);
        }, 3000);

        toast.success(`${updatedUser.username} updated profile!`, {
          position: 'top-right',
          autoClose: 4000,
          pauseOnHover: true,
          draggable: true
        });
      } catch (err) {
        console.error('Error updating contacts in real-time:', err);
      }
    };

    socketInstance.on('LoggingIn', handleLoggingIn);
    socketInstance.on('SigningIn', handleSigningIn);
    socketInstance.on('LoggingOut', handleLoggingOut);
    socketInstance.on('Updating', handleProfileChanged);

    return () => {
      socketInstance.off('LoggingIn', handleLoggingIn);
      socketInstance.off('SigningIn', handleSigningIn);
      socketInstance.off('LoggingOut', handleLoggingOut);
      socketInstance.off('Updating', handleProfileChanged);
    };
  }, [socketInstance, client, handleUpdating]);

  return (
    <>
      {/* Toastify container */}
      <ToastContainer style={{ fontFamily: 'Poppins' }} />

      {/* Optional Radix Toast Viewport (if you want extra styling hooks) */}
      <RadixToast.Provider swipeDirection="right">
        <RadixToast.Viewport className="fixed top-0 right-0 flex flex-col gap-2 p-4 w-96 max-w-screen z-50" />
      </RadixToast.Provider>
    </>
  );
};

export default SocketNotifications;
