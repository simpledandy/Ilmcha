import React, { useState } from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import Text from '@components/Text';
import Input from '@components/Input';
import Button from '@components/Button';
import Images from '@constants/images';
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      setError('Email kiritilishi shart');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // TODO: Implement actual password reset logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err) {
      setError('Xatolik yuz berdi. Qaytadan urinib ko\'ring');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <ImageBackground
      source={Images.backgrounds.auth.white}
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
            Parolni tiklash
          </Text>
          <Text variant="body" style={styles.subtitle}>
            Email manzilingizni kiriting. Biz sizga parolni tiklash bo'yicha ko'rsatmalarni yuboramiz.
          </Text>
        </View>

        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={Images.penguin.poses.holdingPencil}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {success ? (
            <>
              <Text style={styles.successText}>
                Parolni tiklash bo'yicha ko'rsatmalar emailingizga yuborildi
              </Text>
              <Button
                variant="primary"
                size="large"
                style={styles.button}
                onPress={handleBackToLogin}
              >
                Loginga qaytish
              </Button>
            </>
          ) : (
            <>
              <Input
                placeholder="Email manzilingiz"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={error}
              />
              
              <Button
                variant="primary"
                size="large"
                style={styles.button}
                onPress={handleResetPassword}
                loading={loading}
              >
                Parolni tiklash
              </Button>

              <Button
                variant="outline"
                size="large"
                style={styles.button}
                onPress={handleBackToLogin}
              >
                Ortga qaytish
              </Button>
            </>
          )}
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
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: height * 0.5,
  },
  welcomeImage: {
    width: width * 0.8,
    height: height * 0.3,
    marginBottom: 24,
  },
  title: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  button: {
    marginTop: 16,
  },
  successText: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
    lineHeight: 24,
  },
}); 