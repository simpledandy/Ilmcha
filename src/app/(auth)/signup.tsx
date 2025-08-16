import React, { useState } from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { AppText } from '../../components/AppText';
import { AppInput } from '../../components/AppInput';
import { AppButton } from '../../components/AppButton';
import { AppImage } from '../../components/AppImage';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../hooks/useAuth';
import i18n from '@i18n';
import { useAuthAttempt } from './_layout';
import { BackgroundImages, PenguinImages } from '@/src/constants';

const { width, height } = Dimensions.get('window');

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const { setIsAttemptingAuth } = useAuthAttempt();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError(i18n.t('allFieldsRequired'));
      return;
    }

    if (password !== confirmPassword) {
      setError(i18n.t('passwordsDontMatch'));
      return;
    }

    setLoading(true);
    setError('');
    setIsAttemptingAuth(true);

    try {
      const result = await signup(name, email, password);
      
      if (result.success) {
        // The AuthProvider will handle the navigation to onboarding
        // based on the needsOnboarding flag
      } else {
        console.error('❌ Signup failed:', result.error);
        setError(result.error || i18n.t('signupError'));
      }
    } catch (err: any) {
      console.error('❌ Signup error:', err);
      console.error('❌ Error details:', {
        message: err?.message,
        code: err?.code,
        stack: err?.stack
      });
      
      // Show specific error messages based on error type
      if (err?.code === 'SIGNUP_ERROR') {
        setError(err.message || i18n.t('signupError'));
      } else if (err?.message?.includes('User already registered')) {
        setError('An account with this email already exists. Please try logging in instead.');
      } else if (err?.message?.includes('Password should be at least')) {
        setError('Password is too weak. Please choose a stronger password.');
      } else if (err?.message?.includes('Invalid email')) {
        setError('Please enter a valid email address.');
      } else if (err?.message?.includes('rate limit')) {
        setError('Too many signup attempts. Please wait a few minutes and try again.');
      } else if (err?.message?.includes('network') || err?.message?.includes('fetch')) {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(err?.message || i18n.t('signupError'));
      }
    } finally {
      setLoading(false);
      setIsAttemptingAuth(false);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <ImageBackground
      source={BackgroundImages.auth.blue}
      style={styles.container}
    >
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Text Section */}
        <View style={styles.textSection}>
        <AppText variant="heading2" style={styles.title}>
          {i18n.t('signupTitle')}
        </AppText>
        </View>

        {/* Image Section */}
        <View style={styles.imageSection}>
          <AppImage
            source={PenguinImages.poses.withLaptopGreen}
            style={styles.welcomeImage}
            contentFit="contain"
          />
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <AppInput
            placeholder={i18n.t('namePlaceholder')}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            error={error}
          />
          <AppInput
            placeholder={i18n.t('emailPlaceholder')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
          />
          <AppInput
            placeholder={i18n.t('passwordPlaceholder')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={error}
          />
          <AppInput
            placeholder={i18n.t('confirmPasswordPlaceholder')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={error}
          />

          <AppButton
            variant="secondary"
            size="large"
            style={styles.signupButton}
            onPress={handleSignup}
            loading={loading}
          >
            {i18n.t('signupButton')}
          </AppButton>

          <Pressable
            style={styles.loginLink}
            onPress={handleLogin}
          >
            <AppText style={styles.loginLinkText}>
              {i18n.t('haveAccount')}
            </AppText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  textSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  imageSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  formSection: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  welcomeImage: {
    width: width * 0.6,
    height: height * 0.2,
    marginBottom: 24,
  },
  title: {
    color: '#1d99ed',
    textAlign: 'center',
  },
  signupButton: {
    marginTop: 24,
  },
  loginLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginLinkText: {
    width: '80%',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
}); 