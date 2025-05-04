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
import { useAuth } from '@hooks/useAuth'

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email va parol kiritilishi shart');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password);
      router.replace('./');
    } catch (err) {
      setError('Login xatoligi yuz berdi');
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
            Qaytib kelganingizdan xursandmiz!
          </Text>
          <Text variant="body" style={styles.subtitle}>
            Ilmchaga kirish uchun ma'lumotlaringizni kiriting
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
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={error}
          />
          <Input
            placeholder="Parol"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={error}
          />
          
          <Button
            variant="primary"
            size="large"
            style={styles.loginButton}
            onPress={handleLogin}
            loading={loading}
          >
            Kirish
          </Button>

          <Pressable
            style={styles.forgotPasswordLink}
            onPress={() => router.push('/forgot-password')}
          >
            <Text style={styles.forgotPasswordText}>
              Parolni unutdingizmi?
            </Text>
          </Pressable>

          <Pressable
            style={styles.signupLink}
            onPress={handleSignup}
          >
            <Text style={styles.signupLinkText}>
              Akkauntingiz yo'qmi? Ro'yxatdan o'ting
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: '40%',
  },
  formSection: {
    padding: 20,
  },
  welcomeImage: {
    width: '80%',
    height: '80%',
  },
  title: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    maxWidth: '80%',
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
    color: 'rgba(255, 255, 255, 0.8)',
  },
}); 