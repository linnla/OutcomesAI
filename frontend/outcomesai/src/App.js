import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Authenticator,
  View,
  Image,
  useTheme,
  Text,
  Heading,
} from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';

const components = {
  Header() {
    const { tokens } = useTheme();

    return (
      <View textAlign='center' padding={tokens.space.large}>
        <Image
          alt='Amplify logo'
          src='https://docs.amplify.aws/assets/logo-dark.svg'
        />
      </View>
    );
  },

  Footer() {
    const { tokens } = useTheme();

    return (
      <View textAlign='center' padding={tokens.space.large}>
        <Text color={tokens.colors.neutral[80]}>&copy; 2023 CloudRaiders</Text>
      </View>
    );
  },

  SignIn: {
    Header() {
      const { tokens } = useTheme();

      return (
        <Heading
          textAlign='center'
          padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
          level={3}
        >
          Sign in to your account
        </Heading>
      );
    },
    Content() {
      const navigate = useNavigate();

      const handleSignIn = () => {
        // navigate('/leftnavpage');
        // Remove the above line since LeftNavPage is removed
      };

      return (
        <View>
          {/* Your sign-in components */}
          <button onClick={handleSignIn}>Sign In</button>
        </View>
      );
    },
  },
};

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkUserAuthentication();
  }, []);

  const checkUserAuthentication = async () => {
    try {
      await Auth.currentAuthenticatedUser();
      setIsLoggedIn(true);
    } catch (error) {
      setIsLoggedIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      setIsLoggedIn(false);
    } catch (error) {
      console.log('Error signing out:', error);
    }
  };

  return (
    <Authenticator
      loginMechanisms={['email']}
      components={components}
      hideSignUp={true}
    >
      {({ signOut }) => {
        if (isLoggedIn) {
          return (
            <View>
              <Heading textAlign='center'>You are logged in</Heading>
              <button onClick={handleSignOut}>Sign out</button>
            </View>
          );
        }

        return <View>{/* Sign-in components */}</View>;
      }}
    </Authenticator>
  );
};

export default Login;
