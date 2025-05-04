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
import { router } from 'expo-router';
import Text from '@components/Text';
import Input from '@components/Input';
import Button from '@components/Button';
import Images from '@constants/images';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@hooks/useAuth';
import i18n from '@/i18n';

const { width, height } = Dimensions.get('window');

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();

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

    try {
      const result = await signup(name, email, password);
      if (result.success) {
        // The AuthProvider will handle the navigation to onboarding
        // based on the needsOnboarding flag
      } else {
        setError(result.error || i18n.t('signupError'));
      }
    } catch (err) {
      setError(i18n.t('signupError'));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    router.push('/login');
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
          {i18n.t('signupTitle')}
        </Text>
        </View>

        {/* Image Section */}
        <View style={styles.imageSection}>
          <Image
            source={Images.penguin.poses.withLaptopGreen}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Input
            placeholder={i18n.t('namePlaceholder')}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            error={error}
          />
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
          <Input
            placeholder={i18n.t('confirmPasswordPlaceholder')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={error}
          />

          <Button
            variant="secondary"
            size="large"
            style={styles.signupButton}
            onPress={handleSignup}
            loading={loading}
          >
            {i18n.t('signupButton')}
          </Button>

          <Pressable
            style={styles.loginLink}
            onPress={handleLogin}
          >
            <Text style={styles.loginLinkText}>
              {i18n.t('haveAccount')}
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