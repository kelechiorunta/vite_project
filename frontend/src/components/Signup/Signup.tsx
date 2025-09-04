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
const SignupSchema = Yup.object({
  username: Yup.string().min(3, 'At least 3 characters').required('Username is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm your password')
});

type SignupValues = Yup.InferType<typeof SignupSchema>;
type SignupProps = {
  action?: string;
  googleHref?: string;
};

const Signup: React.FC<SignupProps> = ({
  action = '/proxy/auth/signup',
  googleHref = '/api/auth/google'
}) => {
  const [appearance, setAppearance] = React.useState<'light' | 'dark'>('light');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const initialValues: SignupValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  const { toggleTheme, appTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <Theme
      appearance={appearance}
      radius="large"
      scaling="100%"
      accentColor="cyan"
      grayColor="slate"
      panelBackground="solid"
    >
      <Flex
        align="center"
        justify="center"
        direction="column"
        style={{ minHeight: '100vh', padding: '24px' }}
      >
        {/* Top bar */}
        <Flex
          align="center"
          justify="between"
          style={{ width: 'min(100%, 860px)', marginBottom: '24px' }}
        >
          <Heading size="4">Create your account</Heading>
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

        {/* Signup Card */}
        <Box style={{ width: 'min(100%, 480px)' }}>
          <Card size="4" variant="surface">
            <Flex direction="column" gap="5">
              <Flex direction="column" gap="1">
                <Heading as="h1" size="6">
                  Sign up
                </Heading>
                <Text size="2" color="gray">
                  Create an account with username, email & password.
                </Text>
              </Flex>

              <Formik<SignupValues>
                initialValues={initialValues}
                validationSchema={SignupSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  try {
                    const res = await fetch(action, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      credentials: 'include',
                      body: JSON.stringify(values)
                    });
                    if (!res.ok) {
                      const errorData = await res.json();
                      throw new Error(JSON.stringify(errorData));
                    }
                    toast.success('Signup successful! Redirecting...');
                    await new Promise((r) => setTimeout(r, 600));
                    navigate('/');
                  } catch (err: unknown) {
                    if (err instanceof Error) {
                      try {
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
                }) => (
                  <form onSubmit={handleSubmit} noValidate>
                    <Flex direction="column" gap="4">
                      {/* Username */}
                      <div>
                        <Text as="label" size="2" mb="2" style={{ display: 'block' }}>
                          Username
                        </Text>
                        <TextField.Root
                          placeholder="yourname"
                          size="3"
                          variant="soft"
                          name="username"
                          value={values.username}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          color={touched.username && errors.username ? 'red' : 'cyan'}
                          aria-invalid={!!(touched.username && errors.username)}
                          aria-describedby="username-error"
                        >
                          <TextField.Slot>
                            <PersonIcon />
                          </TextField.Slot>
                        </TextField.Root>
                        {touched.username && errors.username && (
                          <Text id="username-error" size="1" color="red" mt="1">
                            {errors.username}
                          </Text>
                        )}
                      </div>

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
                          color={touched.email && errors.email ? 'red' : 'cyan'}
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
                          color={touched.password && errors.password ? 'red' : 'cyan'}
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

                      {/* Confirm Password */}
                      <div>
                        <Text as="label" size="2" mb="2" style={{ display: 'block' }}>
                          Confirm Password
                        </Text>
                        <TextField.Root
                          placeholder="Repeat password"
                          size="3"
                          variant="soft"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={values.confirmPassword}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          color={touched.confirmPassword && errors.confirmPassword ? 'red' : 'cyan'}
                          aria-invalid={!!(touched.confirmPassword && errors.confirmPassword)}
                          aria-describedby="confirmPassword-error"
                        >
                          <TextField.Slot>
                            <LockClosedIcon />
                          </TextField.Slot>
                          <TextField.Slot side="right">
                            <IconButton
                              size="1"
                              variant="ghost"
                              type="button"
                              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                              onClick={() => setShowConfirmPassword((s) => !s)}
                            >
                              {showConfirmPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                            </IconButton>
                          </TextField.Slot>
                        </TextField.Root>
                        {touched.confirmPassword && errors.confirmPassword && (
                          <Text id="confirmPassword-error" size="1" color="red" mt="1">
                            {errors.confirmPassword}
                          </Text>
                        )}
                      </div>

                      {/* Submit */}
                      <Button size="3" type="submit" disabled={isSubmitting}>
                        Sign up <ArrowRightIcon />
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
                Already have an account? <RadixLink href="/login">Login here</RadixLink>
              </Text>
            </Flex>
          </Card>
        </Box>
      </Flex>
    </Theme>
  );
};

export default Signup;
