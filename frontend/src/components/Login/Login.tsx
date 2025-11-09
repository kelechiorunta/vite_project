// Login.tsx
import * as React from 'react';
import {
  Theme,
  Box,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
  Button,
  Separator,
  Link as RadixLink,
  // Checkbox,
  IconButton
} from '@radix-ui/themes';
import {
  PersonIcon,
  LockClosedIcon,
  EyeOpenIcon,
  EyeClosedIcon,
  SunIcon,
  MoonIcon,
  ArrowRightIcon
} from '@radix-ui/react-icons';
import { useTheme } from '../theme-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';

// ---- Validation
const LoginSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required')
  // rememberMe: Yup.boolean().default(false)
});

type LoginValues = Yup.InferType<typeof LoginSchema>;

type LoginProps = {
  action?: string;
  googleHref?: string;
};

const Login: React.FC<LoginProps> = ({
  action = '/proxy/auth/signin',
  googleHref = '/proxy/auth/google'
}) => {
  const [appearance, setAppearance] = React.useState<'light' | 'dark'>('light');
  const [showPassword, setShowPassword] = React.useState(false);

  const initialValues: LoginValues = {
    email: '',
    password: ''
    // rememberMe: false
  };
  const { toggleTheme, appTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <Theme
      appearance={appTheme ? 'light' : 'dark'}
      radius="large"
      scaling="100%"
      accentColor="indigo"
      grayColor="slate"
      panelBackground="solid"
    >
      <Flex
        align="center"
        justify="center"
        direction="column"
        style={{ maxHeight: '100%', padding: '24px', maxWidth: '600px' }}
      >
        {/* Top bar */}
        <Flex
          align="center"
          justify="between"
          style={{ width: 'min(100%, 1440px)', marginBottom: '24px' }}
        >
          <Heading size="4">JustChat</Heading>
          <Flex align="center" gap="2">
            <Text size="2" color="gray">
              Theme
            </Text>
            <IconButton
              size="2"
              variant="soft"
              aria-label="Toggle theme"
              onClick={() => {
                toggleTheme(!appTheme);
                setAppearance((a) => (a === 'light' ? 'dark' : 'light'));
              }}
            >
              {appearance === 'light' ? <SunIcon /> : <MoonIcon />}
            </IconButton>
          </Flex>
        </Flex>

        {/* Login card */}
        <Box style={{ width: 'min(100%, 420px)' }}>
          <Card size="4" variant="surface">
            <Flex direction="column" gap="5">
              <Flex direction="column" gap="1">
                <Heading as="h1" size="6">
                  Login
                </Heading>
                <Text size="2" color="gray">
                  Use your email and password, or continue with Google.
                </Text>
              </Flex>

              <Formik<LoginValues>
                initialValues={initialValues}
                validationSchema={LoginSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    const res = await fetch(action, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include',
                      body: JSON.stringify(values)
                    });

                    if (!res.ok) {
                      // backend returns JSON with error
                      const errorData = await res.json();
                      throw new Error(JSON.stringify(errorData));
                    }

                    // optional: show a success toast before redirect
                    toast.success('Login successful! Redirecting...');
                    await new Promise((r) => setTimeout(r, 600));
                    navigate('/');
                    // window.location.href = '/';
                  } catch (err: unknown) {
                    if (err instanceof Error) {
                      try {
                        // Try parsing backend error
                        const parsed = JSON.parse(err.message);
                        toast.error(parsed?.error ?? 'Something went wrong');
                      } catch {
                        toast.error(err.message || 'An unexpected error occurred');
                      }
                    } else {
                      toast.error('An unexpected error occurred');
                    }
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  isSubmitting
                  // setFieldValue
                }) => (
                  <form onSubmit={handleSubmit} noValidate>
                    <Flex direction="column" gap="4">
                      {/* Email */}
                      <div>
                        <Text as="label" size="2" mb="2" style={{ display: 'block' }}>
                          Email
                        </Text>
                        <TextField.Root
                          placeholder="you@example.com"
                          size="3"
                          variant="soft"
                          name="email"
                          type="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          color={touched.email && errors.email ? 'red' : 'indigo'}
                          aria-invalid={!!(touched.email && errors.email)}
                          aria-describedby="email-error"
                        >
                          <TextField.Slot>
                            <PersonIcon />
                          </TextField.Slot>
                        </TextField.Root>
                        {touched.email && errors.email && (
                          <Text id="email-error" size="1" color="red" mt="1">
                            {errors.email}
                          </Text>
                        )}
                      </div>

                      {/* Password */}
                      <div>
                        <Text as="label" size="2" mb="2" style={{ display: 'block' }}>
                          Password
                        </Text>
                        <TextField.Root
                          placeholder="Your password"
                          size="3"
                          variant="soft"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          color={touched.password && errors.password ? 'red' : 'indigo'}
                          aria-invalid={!!(touched.password && errors.password)}
                          aria-describedby="password-error"
                        >
                          <TextField.Slot>
                            <LockClosedIcon />
                          </TextField.Slot>
                          <TextField.Slot side="right">
                            <IconButton
                              size="1"
                              variant="ghost"
                              type="button"
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                              onClick={() => setShowPassword((s) => !s)}
                            >
                              {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                            </IconButton>
                          </TextField.Slot>
                        </TextField.Root>
                        {touched.password && errors.password && (
                          <Text id="password-error" size="1" color="red" mt="1">
                            {errors.password}
                          </Text>
                        )}
                      </div>

                      {/* Remember me + Forgot */}
                      <Flex align="center" justify="between">
                        <Flex align="center" gap="2">
                          {/* <Checkbox
                            checked={values.rememberMe}
                            onCheckedChange={(checked) =>
                              setFieldValue('rememberMe', Boolean(checked))
                            }
                            id="remember"
                          />
                          <Text as="label" htmlFor="remember" size="2" color="gray">
                            Remember me
                          </Text> */}
                        </Flex>
                        <RadixLink href="/forgot-password" size="2">
                          Forgot password?
                        </RadixLink>
                      </Flex>

                      {/* Submit */}
                      <Button size="3" type="submit" disabled={isSubmitting}>
                        Sign in
                        <ArrowRightIcon />
                      </Button>

                      {/* OR Divider */}
                      <Flex align="center" gap="3" my="2">
                        <Separator style={{ flex: 1 }} />
                        <Text size="2" color="gray">
                          OR
                        </Text>
                        <Separator style={{ flex: 1 }} />
                      </Flex>

                      {/* Google OAuth */}
                      <Button asChild size="3" variant="soft" color="red">
                        <a href={googleHref} style={{ textDecoration: 'none' }}>
                          Continue with Google
                        </a>
                      </Button>
                    </Flex>
                  </form>
                )}
              </Formik>

              {/* Bottom text */}
              <Text size="2" color="gray" align="center">
                Don’t have an account? <RadixLink href="/register">Create one</RadixLink>
              </Text>
            </Flex>
          </Card>
        </Box>
      </Flex>
    </Theme>
  );
};

export default Login;
