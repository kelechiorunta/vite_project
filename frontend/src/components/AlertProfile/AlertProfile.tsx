// import { AlertDialog, Avatar, Badge, Button, Flex, Grid, Text, TextField } from '@radix-ui/themes';
// import React from 'react';
// import type { AuthContextType } from '../Home/Home';

// export type AlertComponentType = {
//   component: React.ReactNode | null;
//   user?: AuthContextType | undefined;
// };

// export default function AlertProfile({ component, user }: AlertComponentType) {
//   return (
//     <AlertDialog.Root>
//       <AlertDialog.Trigger>{component}</AlertDialog.Trigger>
//       <AlertDialog.Content maxWidth="450px">
//         <AlertDialog.Title>Edit Profile</AlertDialog.Title>
//         <AlertDialog.Description size="2">
//           Please make changes to your current profile
//         </AlertDialog.Description>
//         <Flex gap={'2'} mt={'4'} position={'relative'}>
//           <Avatar radius="full" src={user?.picture} fallback={'App'} />
//           <Badge
//             style={{ position: 'absolute', bottom: -4, left: 25, zIndex: 10, borderRadius: '100%' }}
//             color="grass"
//           >
//             ●
//           </Badge>
//           <Grid>
//             <Text size={'2'}>{user?.username}</Text>
//             <Text size={'1'}>{user?.email}</Text>
//           </Grid>
//         </Flex>
//         <Flex mt={'4'} direction="column" gap="2">
//           <label>
//             <Text as="div" size="2" mb="1" weight="bold">
//               Username
//             </Text>
//             <TextField.Root defaultValue={user?.username} placeholder="Enter your username" />
//           </label>
//           <label>
//             <Text as="div" size="2" mb="1" weight="bold">
//               Email
//             </Text>
//             <TextField.Root defaultValue={user?.email} placeholder="Enter your email" />
//           </label>
//           <label>
//             <Text as="div" size="2" mb="1" weight="bold">
//               Phone
//             </Text>
//             <TextField.Root defaultValue={user?.phone} placeholder="Enter your phone" />
//           </label>
//           <label>
//             <Text as="div" size="2" mb="1" weight="bold">
//               Address
//             </Text>
//             <TextField.Root defaultValue={user?.address} placeholder="Enter your address" />
//           </label>
//           <label>
//             <Text as="div" size="2" mb="1" weight="bold">
//               Birthday
//             </Text>
//             <TextField.Root defaultValue={user?.birthday} placeholder="Enter your birthday" />
//           </label>
//         </Flex>
//         <Flex gap="3" mt="4" justify="end">
//           <AlertDialog.Cancel>
//             <Button variant="soft" color="gray">
//               Cancel
//             </Button>
//           </AlertDialog.Cancel>
//           <AlertDialog.Action>
//             <Button variant="solid" color="green">
//               Save Changes
//             </Button>
//           </AlertDialog.Action>
//         </Flex>
//       </AlertDialog.Content>
//     </AlertDialog.Root>
//   );
// }

// import { AlertDialog, Avatar, Badge, Button, Flex, Grid, Text, TextField } from '@radix-ui/themes';
// import React, { useState } from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import type { AuthContextType } from '../Home/Home';

// export type AlertComponentType = {
//   component: React.ReactNode | null;
//   user?: AuthContextType | undefined;
// };

// export default function AlertProfile({ component, user }: AlertComponentType) {
//   const [preview, setPreview] = useState(user?.picture || '');

//   const formik = useFormik({
//     initialValues: {
//       username: user?.username || '',
//       email: user?.email || '',
//       phone: user?.phone || '',
//       address: user?.address || '',
//       birthday: user?.birthday || '',
//       picture: user?.picture || ''
//     },
//     validationSchema: Yup.object({
//       username: Yup.string().required('Username is required'),
//       email: Yup.string().email('Invalid email').required('Email is required'),
//       phone: Yup.string(),
//       address: Yup.string(),
//       birthday: Yup.string()
//     }),
//     onSubmit: (values) => {
//       console.log('Form Submitted ✅', values);
//       // You can integrate your mutation or API call here
//     }
//   });

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreview(reader.result as string);
//         formik.setFieldValue('picture', reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   return (
//     <AlertDialog.Root>
//       <AlertDialog.Trigger>{component}</AlertDialog.Trigger>
//       <AlertDialog.Content maxWidth="450px">
//         <AlertDialog.Title>Edit Profile</AlertDialog.Title>
//         <AlertDialog.Description size="1">
//           Please make changes to your current profile
//         </AlertDialog.Description>

//         <form onSubmit={formik.handleSubmit}>
//           <Flex gap="2" mt="4" position="relative" align="center">
//             <Avatar
//               radius="full"
//               src={preview}
//               fallback={user?.username?.[0]?.toUpperCase() || 'U'}
//               size="6"
//             />
//             <Badge
//               asChild
//               style={{
//                 position: 'absolute',
//                 bottom: -4,
//                 left: 28,
//                 zIndex: 10,
//                 borderRadius: '100%',
//                 cursor: 'pointer'
//               }}
//               color="grass"
//             >
//               <label htmlFor="picture-upload" style={{ cursor: 'pointer' }}>
//                 📸
//               </label>
//             </Badge>
//             <input
//               id="picture-upload"
//               type="file"
//               accept="image/*"
//               style={{ display: 'none' }}
//               onChange={handleFileChange}
//             />
//             <Grid>
//               <Text size="2">{user?.username}</Text>
//               <Text size="1" color="gray">
//                 {user?.email}
//               </Text>
//             </Grid>
//           </Flex>

//           <Flex mt="4" direction="column" gap="2">
//             {[
//               { label: 'Username', name: 'username', placeholder: 'Enter your username' },
//               { label: 'Email', name: 'email', placeholder: 'Enter your email' },
//               { label: 'Phone', name: 'phone', placeholder: 'Enter your phone' },
//               { label: 'Address', name: 'address', placeholder: 'Enter your address' },
//               { label: 'Birthday', name: 'birthday', placeholder: 'Enter your birthday' }
//             ].map(({ label, name, placeholder }) => (
//               <label key={name}>
//                 <Text as="div" size="2" mb="1" weight="bold">
//                   {label}
//                 </Text>
//                 <TextField.Root
//                   id={name}
//                   name={name}
//                   value={formik.values[name as keyof typeof formik.values]}
//                   onChange={formik.handleChange}
//                   placeholder={placeholder}
//                   color={formik.errors[name as keyof typeof formik.errors] ? 'red' : undefined}
//                 />
//                 {formik.touched[name as keyof typeof formik.touched] &&
//                   formik.errors[name as keyof typeof formik.errors] && (
//                     <Text size="1" color="red">
//                       {formik.errors[name as keyof typeof formik.errors]}
//                     </Text>
//                   )}
//               </label>
//             ))}
//           </Flex>

//           <Flex gap="3" mt="4" justify="end">
//             <AlertDialog.Cancel>
//               <Button variant="soft" color="gray">
//                 Cancel
//               </Button>
//             </AlertDialog.Cancel>
//             <AlertDialog.Action>
//               <Button type="submit" variant="solid" color="green">
//                 Save Changes
//               </Button>
//             </AlertDialog.Action>
//           </Flex>
//         </form>
//       </AlertDialog.Content>
//     </AlertDialog.Root>
//   );
// }

import {
  AlertDialog,
  Avatar,
  Badge,
  Button,
  Flex,
  Grid,
  Text,
  TextField,
  Popover
} from '@radix-ui/themes';
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import type { AuthContextType } from '../Home/Home';

export type AlertComponentType = {
  component: React.ReactNode | null;
  user?: AuthContextType | undefined | null;
  handleProfileUpdate?: (props: AuthContextType) => void;
};

export default function AlertProfile({ component, user, handleProfileUpdate }: AlertComponentType) {
  const [preview, setPreview] = useState(user?.picture || user?.logo || '');
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(
    user?.birthday ? new Date(user.birthday) : undefined
  );

  const formik = useFormik({
    initialValues: {
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      birthday: user?.birthday || '',
      picture: user?.picture || '',
      logo: user?.logo || ''
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      phone: Yup.string(),
      address: Yup.string(),
      birthday: Yup.string()
    }),
    onSubmit: async (values) => {
      console.log('✅ Form submitted:', values);
      try {
        if (handleProfileUpdate) {
          handleProfileUpdate(values);
          console.log('Submitted');
        }
      } catch (err) {
        console.error(err);
      }

      // Add your GraphQL mutation or API request here
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        formik.setFieldValue('picture', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDaySelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDay(date);
      const formatted = date.toISOString().split('T')[0];
      formik.setFieldValue('birthday', formatted);
    }
  };

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>{component}</AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Edit Profile</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Please make changes to your current profile
        </AlertDialog.Description>

        <form onSubmit={formik.handleSubmit}>
          {/* Avatar + Upload Badge */}
          <Flex gap="2" mt="4" position="relative" align="center">
            <Avatar
              radius="full"
              src={preview}
              fallback={user?.username?.[0]?.toUpperCase() || 'U'}
              size="6"
            />
            <Badge
              asChild
              style={{
                position: 'absolute',
                bottom: -4,
                left: 28,
                zIndex: 10,
                borderRadius: '100%',
                cursor: 'pointer'
              }}
              color="grass"
            >
              <label htmlFor="picture-upload" style={{ cursor: 'pointer' }}>
                📸
              </label>
            </Badge>
            <input
              id="picture-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Grid>
              <Text size="2">{user?.username}</Text>
              <Text size="1" color="gray">
                {user?.email}
              </Text>
            </Grid>
          </Flex>

          {/* Editable Fields */}
          <Flex mt="4" direction="column" gap="2">
            {[
              { label: 'Username', name: 'username', placeholder: 'Enter your username' },
              { label: 'Email', name: 'email', placeholder: 'Enter your email' },
              { label: 'Phone', name: 'phone', placeholder: 'Enter your phone' },
              { label: 'Address', name: 'address', placeholder: 'Enter your address' }
            ].map(({ label, name, placeholder }) => (
              <label key={name}>
                <Text as="div" size="2" mb="1" weight="bold">
                  {label}
                </Text>
                <TextField.Root
                  id={name}
                  name={name}
                  value={formik.values[name as keyof typeof formik.values]}
                  onChange={formik.handleChange}
                  placeholder={placeholder}
                  color={formik.errors[name as keyof typeof formik.errors] ? 'red' : undefined}
                />
                {formik.touched[name as keyof typeof formik.touched] &&
                  formik.errors[name as keyof typeof formik.errors] && (
                    <Text size="1" color="red">
                      {formik.errors[name as keyof typeof formik.errors]}
                    </Text>
                  )}
              </label>
            ))}

            {/* 🎂 Birthday with Calendar Picker */}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Birthday
              </Text>
              <Popover.Root>
                <Popover.Trigger>
                  <TextField.Root
                    readOnly
                    value={formik.values.birthday || ''}
                    placeholder="Select your birthday"
                  />
                </Popover.Trigger>
                <Popover.Content sideOffset={4}>
                  <DayPicker
                    mode="single"
                    selected={selectedDay}
                    onSelect={handleDaySelect}
                    captionLayout="dropdown"
                    fromYear={1950}
                    toYear={new Date().getFullYear()}
                  />
                </Popover.Content>
              </Popover.Root>
            </label>
          </Flex>

          {/* Buttons */}
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button type="submit" variant="solid" color="green">
                Save Changes
              </Button>
            </AlertDialog.Action>
          </Flex>
        </form>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
