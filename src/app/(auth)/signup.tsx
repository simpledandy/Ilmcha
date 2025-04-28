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
      setError('Barcha maydonlar to\'ldirilishi shart');
      return;
    }

    if (password !== confirmPassword) {
      setError('Parollar mos kelmadi');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signup(name, email, password);
      router.replace('../(app)'); // Replace with your main app route
    } catch (err) {
      setError('Ro\'yxatdan o\'tishda xatolik yuz berdi');
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
            Yangi sarguzashtga tayyormisiz?
          </Text>
          <Text variant="body" style={styles.subtitle}>
            Ilmchada o'z hisobingizni yarating
          </Text>
        </View>

        {/* Image Section */}
        <View style={styles.imageSection}>
          <Image
            source={Images.penguin.poses.withLaptopPink}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          <Input
            placeholder="Ismingiz"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            error={error}
          />
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
          <Input
            placeholder="Parolni tasdiqlang"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={error}
          />
          
          <Button
            variant="primary"
            size="large"
            style={styles.signupButton}
            onPress={handleSignup}
            loading={loading}
          >
            Ro'yxatdan o'tish
          </Button>

          <Pressable
            style={styles.loginLink}
            onPress={handleLogin}
          >
            <Text style={styles.loginLinkText}>
              Akkauntingiz bormi? Kiring
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
    paddingTop: 60,
  },
  imageSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formSection: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  welcomeImage: {
    width: width * 0.8,
    height: height * 0.3,
    marginBottom: 24,
  },
  title: {
    color: 'white',
    textAlign: 'center',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    maxWidth: '80%',
  },
  signupButton: {
    marginTop: 24,
  },
  loginLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginLinkText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
}); 