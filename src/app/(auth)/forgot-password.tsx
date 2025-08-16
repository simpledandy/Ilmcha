import React, { useState } from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { AppButton, AppImage, AppInput, AppText } from '@components';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { supabase } from '@utils/supabaseClient';
import { BackgroundImages, PenguinImages } from '@/src/constants';

const { width, height } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      setError(t('emailRequiredError'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'myapp://reset-password',
      });

      if (resetError) {
        throw resetError;
      }

      setSuccess(true);
    } catch (err: any) {
      let message = 'Unknown error';
      if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <ImageBackground
      source={BackgroundImages.auth.white}
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
            {t('forgotPasswordTitle')}
          </AppText>
          <AppText variant="body" style={styles.subtitle}>
            {t('forgotPasswordSubtitle')}
          </AppText>
        </View>

        {/* Image Section */}
        <View style={styles.imageContainer}>
          <AppImage
            source={PenguinImages.poses.withLaptopGreen}
            style={styles.welcomeImage}
            contentFit="contain"
          />
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {success ? (
            <>
              <AppText style={styles.successText}>
                {t('resetSuccessMessage')}
              </AppText>
              <AppButton
                variant="primary"
                size="large"
                style={styles.button}
                onPress={handleBackToLogin}
              >
                {t('backToLoginButton')}
              </AppButton>
            </>
          ) : (
            <>
              <AppInput
                placeholder={t('emailPlaceholder')}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={error}
              />
              
              <AppButton
                variant="primary"
                size="large"
                style={styles.button}
                onPress={handleResetPassword}
                loading={loading}
              >
                {t('resetPasswordButton')}
              </AppButton>

              <AppButton
                variant="secondary"
                size="large"
                style={styles.button}
                onPress={handleBackToLogin}
              >
                {t('backToLoginButton')}
              </AppButton>
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