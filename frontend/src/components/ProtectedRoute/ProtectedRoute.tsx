import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
// import { Spinner } from '../Spinner/Spinner';
import { Spinner } from '@radix-ui/themes';

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true); // start as true
  const [currentUser, setCurrentUser] = useState<object | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/proxy/auth/isAuthenticated', {
          credentials: 'include',
          method: 'GET'
        });

        const contentType = response.headers.get('content-type');

        let data;
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // fallback for HTML/plain responses
          const text = await response.text();
          console.log(text);
          data = { error: 'Unauthorized. Please login.' };
        }

        if (!response.ok || !data.user) {
          // prefer backend-provided error message
          throw new Error(data.error || 'Unauthorized');
        }

        setCurrentUser(data.user);
        setIsAuthenticated(true);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message || 'Something went wrong');
        } else {
          toast.error('An unexpected error occurred');
        }

        setIsAuthenticated(false);
        setCurrentUser(null);
        localStorage.removeItem('entry');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          // inset: 0,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          minHeight: '100vh',
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
      >
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ path: location.pathname }} replace />;
  }

  return <Outlet context={currentUser} />;
}
