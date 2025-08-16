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
import { Link, router } from 'expo-router';
import { AppText } from '../../components/AppText';
import { AppInput } from '../../components/AppInput';
import { AppButton } from '../../components/AppButton';
import { AppImage } from '../../components/AppImage';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../hooks/useAuth'
import i18n from '@i18n';
import { useAuthAttempt } from './_layout';
import { useAuthError } from '../../providers/AuthErrorContext';
import { useAudio } from '../../providers/AudioProvider';
import { useFocusEffect } from '@react-navigation/native';
import { BackgroundImages, PenguinImages } from '@/src/constants';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  // Remove local error state
  // const [error, setError] = useState('');
  const { login } = useAuth();
  const { setIsAttemptingAuth } = useAuthAttempt();
  const { error, clearError } = useAuthError();

  const { play, stop } = useAudio();
  useFocusEffect(
    React.useCallback(() => {
      play('navigation', true);
      return () => {
        stop();
      };
    }, [play, stop])
  );

  const handleLogin = async () => {
    if (!email || !password) {
      // setError(i18n.t('loginError'));
      clearError();
      return;
    }

    setLoading(true);
    // setError('');
    setIsAttemptingAuth(true);
    clearError();

    try {
      await login(email, password);
      // Do not navigate here, AuthProvider will handle it
    } catch (err: any) {
      // Error will be set in context by AuthProvider
    } finally {
      setLoading(false);
      setIsAttemptingAuth(false);
    }
  };

  const handleSignup = () => {
    router.push('/signup');
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
            {i18n.t('loginTitle')}
          </AppText>
        </View>

        {/* Image Section */}
        <View style={styles.imageSection}>
          <AppImage
            source={PenguinImages.poses.wavingGray}
            style={styles.welcomeImage}
            contentFit="contain"
          />
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {error ? (
            <AppText style={{ color: 'red', marginBottom: 12, textAlign: 'center' }}>{error}</AppText>
          ) : null}
          <AppInput
            placeholder={i18n.t('emailPlaceholder')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={error ?? undefined}
          />
          <AppInput
            placeholder={i18n.t('passwordPlaceholder')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={error ?? undefined}
          />
          
          <AppButton
            variant="secondary"
            size="large"
            style={styles.loginButton}
            onPress={handleLogin}
            loading={loading}
          >
            {i18n.t('loginButton')}
          </AppButton>

          <Link href="/forgot-password" style={{ marginTop: 10 }}>
            <AppText style={{ color: '#007AFF', textAlign: 'center' }}>{i18n.t('forgotPassword')}</AppText>
          </Link>

          <Pressable
            style={styles.signupLink}
            onPress={handleSignup}
          >
            <AppText style={styles.signupLinkText}>
              {i18n.t('noAccount')}
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
  },
  textSection: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  imageSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  formSection: {
    padding: 20,
  },
  welcomeImage: {
    width: width * 0.6,
    height: height * 0.2,
    marginBottom: 24,
  },
  title: {
    color: '#1d99ed',
    textAlign: 'center',
    marginBottom: 12,
  },
  loginButton: {
    marginTop: 24,
  },
  forgotPasswordLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: 'rgba(255, 255, 255, 0.8)',
    textDecorationLine: 'underline',
  },
  signupLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  signupLinkText: {
    width: '80%',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
}); 