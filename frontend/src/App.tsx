import './App.css';
import { Route, Routes } from 'react-router';

import Login from './components/Login/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Home from './components/Home/Home';
import Signup from './components/Signup/Signup';
import { Card, Grid, Heading, Inset, Separator, Text } from '@radix-ui/themes';
import LandingCaption from './components/LandingCaption/LandingCaption';

function App() {
  // const { toggleTheme, appTheme } = useTheme();

  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
      </Route>

      <Route
        path="/login"
        element={
          <Grid
            style={{ padding: '2' }}
            columns={{ xs: '1', sm: '2', md: '2', lg: '2', xl: '2' }}
            gap="1"
            width="100%"
            height={'100%'}
            justify={'center'}
            align={'center'}
          >
            <LandingCaption />

            <Login />
          </Grid>
        }
      />
      <Route
        path="/register"
        element={
          <Grid
            style={{ padding: '2' }}
            columns={{ xs: '1', sm: '2', md: '2', lg: '2', xl: '2' }}
            gap="1"
            width="100%"
            height={'100%'}
            justify={'center'}
            align={'center'}
          >
            <LandingCaption />

            {/* <Separator /> */}

            <Signup />
          </Grid>
        }
      />
    </Routes>
  );
}

export default App;
