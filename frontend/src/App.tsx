import './App.css';
import { Route, Routes } from 'react-router';

import Login from './components/Login/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Home from './components/Home/Home';
import Signup from './components/Signup/Signup';
import { Avatar, Flex, Grid, Heading } from '@radix-ui/themes';
import LandingCaption from './components/LandingCaption/LandingCaption';

import Slider from './components/Slider/Slider';
// import happyImg from '/assets/happy.jpg';
import AnimateText from './components/AnimateText/AnimateText';

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
          // <div style={{ overflow: 'hidden', width: '100%' }}>
          //   <AlertDialog.Root defaultOpen>
          //     <AlertDialog.Content
          //       width={{ initial: '100%', xs: '90%', sm: '90%', md: '75%', lg: '95%' }}
          //       maxWidth={{ initial: '100%', xs: '90%', sm: '90%', md: '75%', lg: '95%' }}
          //       minWidth={{ initial: '105%', xs: '90%', sm: '90%', md: '75%', lg: '95%' }}
          //       maxHeight={{ initial: '100%', xs: '90%', sm: '90%', md: '75%', lg: '95%' }}
          //       style={{ overflow: 'hidden' }}
          //       // position={{ initial: 'absolute', xs: 'absolute', md: 'relative', lg: 'relative' }}
          //     >
          <Flex
            // style={{ padding: '2' }}
            p={'2'}
            pr={'2'}
            wrap={'wrap'}
            // columns={{ xs: '1', sm: '2', md: '2', lg: '2', xl: '2' }}
            gap="2"
            width={{ initial: '100%', xs: '100%', sm: '100%', md: '100%', lg: '100%' }}
            maxWidth={{ initial: '100%', xs: '100%', sm: '100%', md: '100%', lg: '100%' }}
            minWidth={{ initial: '100%', xs: '100%', sm: '100%', md: '100%', lg: '100%' }}
            maxHeight={'100%'}
            justify={'center'}
            align={'center'}
            style={{ margin: 'auto', overflow: 'hidden' }}
            //  position={{ initial: 'absolute', xs: 'absolute', md: 'relative', lg: 'relative' }}
          >
            {/* <LandingCaption /> */}
            <Flex
              // position={{
              //   initial: 'absolute',
              //   xs: 'absolute',
              //   md: 'relative',
              //   lg: 'relative'
              // }}
              width={{ initial: '100%', xs: '100%', sm: '100%', md: '100%', lg: '100%' }}
            >
              <Avatar
                src="/assets/happy.jpg"
                fallback="/assets/happy.jpg"
                size={'9'}
                style={{
                  // maxHeight: '70vh',
                  // height: '100%',
                  // minHeight: '70vh',
                  width: '100%',
                  // minWidth: '400px',
                  // backgroundImage: `url(${happyImg})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  // position: 'relative',
                  borderRadius: '20px'
                }}
              />
              <div style={{ position: 'absolute', top: 20, left: 10 }}>
                <Slider buttonVisible={false} />
              </div>

              <div style={{ position: 'absolute', top: 20, right: 20 }}>
                <Heading>
                  <AnimateText texts={['JUSTCHAT', `Let's Connect`]} />
                </Heading>
              </div>
            </Flex>

            {/* <Flex */}
            {/* // position={{ initial: 'absolute' }} */}
            {/* // width={{ initial: '100%', xs: '90%', sm: '90%', md: '40%', lg: '50%' }} */}
            {/* > */}
            <Login />
            {/* </Flex> */}
          </Flex>
          //     </AlertDialog.Content>
          //   </AlertDialog.Root>
          // </div>
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
            <Signup />
          </Grid>
        }
      />
    </Routes>
  );
}

export default App;
