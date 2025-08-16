import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppText } from '@components/AppText';
import { AppInput } from '@components/AppInput';
import { AppButton } from '@components/AppButton';
import { AppImage } from '@components/AppImage';
import { useTranslation } from 'react-i18next';
import { supabase } from '@utils/supabaseClient';
import { BackgroundImages, PenguinImages } from '@/src/constants';

const { width, height } = Dimensions.get('window');

export default function ResetPasswordScreen() {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const params = useLocalSearchParams();

  useEffect(() => {
    // Handle deep link parameters for password reset
    if (params.access_token && params.refresh_token) {
      // Set the session from the reset link
      supabase.auth.setSession({
        access_token: params.access_token as string,
        refresh_token: params.refresh_token as string,
      });
    }
  }, [params]);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setError(t('allFieldsRequired'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('passwordsDontMatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('passwordTooShort'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 2000);
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
    router.replace('/(auth)/login');
  };

  return (
    <ImageBackground
      source={BackgroundImages.auth.blue}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Text Section */}
        <View style={styles.textSection}>
          <AppText variant="heading2" style={styles.title}>
            {t('setNewPassword')}
          </AppText>
          <AppText variant="body" style={styles.subtitle}>
            {t('setNewPasswordSubtitle')}
          </AppText>
        </View>

        {/* Image Section */}
        <View style={styles.imageContainer}>
          <AppImage
            source={PenguinImages.poses.wavingPink}
            style={styles.welcomeImage}
            contentFit="contain"
          />
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {success ? (
            <>
              <AppText style={styles.successText}>
                {t('passwordResetSuccess')}
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
                placeholder={t('newPasswordPlaceholder')}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError('');
                }}
                secureTextEntry
                error={error}
              />
              
              <AppInput
                placeholder={t('confirmNewPasswordPlaceholder')}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setError('');
                }}
                secureTextEntry
                error={error}
              />
              
              <AppButton
                variant="primary"
                size="large"
                style={styles.button}
                onPress={handleResetPassword}
                loading={loading}
              >
                {t('setNewPasswordButton')}
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