import React, { useState } from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
  Pressable,
} from 'react-native';
import { Link, router } from 'expo-router';
import Text from '../../components/Text';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Images from '../../constants/images';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../hooks/useAuth'
import i18n from '../../../i18n';
import { createClient } from '@supabase/supabase-js';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError(i18n.t('loginError'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      router.replace('/');
    } catch (err) {
      setError(i18n.t('loginError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  return (
    <ImageBackground
      source={Images.backgrounds.auth.blue}
      style={styles.container}
    >
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Text Section */}
        <View style={styles.textSection}>
          <Text variant="heading2" style={styles.title}>
            {i18n.t('loginTitle')}
          </Text>
        </View>

        {/* Image Section */}
        <View style={styles.imageSection}>
          <Image
            source={Images.penguin.poses.wavingGray}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Input
            placeholder={i18n.t('emailPlaceholder')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
          />
          <Input
            placeholder={i18n.t('passwordPlaceholder')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={error}
          />
          
          <Button
            variant="secondary"
            size="large"
            style={styles.loginButton}
            onPress={handleLogin}
            loading={loading}
          >
            {i18n.t('loginButton')}
          </Button>

          <Pressable
            style={styles.forgotPasswordLink}
            onPress={() => router.push('/forgot-password')}
          >
            <Text style={styles.forgotPasswordText}>
              {i18n.t('forgotPassword')}
            </Text>
          </Pressable>

          <Pressable
            style={styles.signupLink}
            onPress={handleSignup}
          >
            <Text style={styles.signupLinkText}>
              {i18n.t('noAccount')}
            </Text>
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