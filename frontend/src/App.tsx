import { useEffect } from 'react';

import toast from 'react-hot-toast';

// import { Flex, Text, Button, Grid, Switch, TextArea, Card, Box } from '@radix-ui/themes';
// import { HomeIcon, ArrowUpIcon } from '@radix-ui/react-icons';
// import { useTheme } from './components/theme-context';

import Login from './components/Login/Login';

import './App.css';
import { Route, Routes } from 'react-router';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Home from './components/Home/Home';
import Signup from './components/Signup/Signup';

function App() {
  // const { toggleTheme, appTheme } = useTheme();

  useEffect(() => {
    const getProxy = async () => {
      try {
        const response = await fetch('/proxy/api', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          console.log(errorResponse);
          throw new Error(JSON.stringify(errorResponse));
        }
        const data = await response.json();
        console.log(data);
      } catch (err: unknown) {
        console.error(err);
        if (err instanceof Error) {
          try {
            // Try parsing backend error
            const parsed = JSON.parse(err.message);
            console.log(parsed);
            toast.error(parsed?.error ?? 'Something went wrong');
          } catch {
            console.error(err.message);
            // toast.error(err.message || 'An unexpected error occurred');
          }
        } else {
          console.error('Error');
          // toast.error('Error');
        }
      }
    };
    getProxy();
  }, []);

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        {/* <Route
          path="*"
          element={
            <div className="App">
              <App />
            </div>
          }
        /> */}
        <Route
          path="/"
          element={
            // <div className="App">
            <Home />
            // </div>
          }
        />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
    </Routes>
  );
}

export default App;
