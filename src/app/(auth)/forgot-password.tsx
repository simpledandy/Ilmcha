import React, { FC, useState } from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { goBack } from '@utils/navigation';
import { Text } from '@components/Text';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { BackgroundImages, PenguinImages } from '@constants/images/images';
import { useRouter } from 'expo-router';
import { useAuth } from '@hooks/useAuth';

const { width, height } = Dimensions.get('window');

export const ForgotPasswordScreen: React.FC = () => {
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
      // TODO: Implement actual password reset logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err) {
      setError(t('resetError'));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    goBack();
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
          <Text variant="heading2" style={styles.title}>
            {t('forgotPasswordTitle')}
          </Text>
          <Text variant="body" style={styles.subtitle}>
            {t('forgotPasswordSubtitle')}
          </Text>
        </View>

        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={PenguinImages.poses.holdingPencilPink}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          {success ? (
            <>
              <Text style={styles.successText}>
                {t('resetSuccessMessage')}
              </Text>
              <Button
                variant="primary"
                size="large"
                style={styles.button}
                onPress={handleBackToLogin}
              >
                {t('backToLoginButton')}
              </Button>
            </>
          ) : (
            <>
              <Input
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
              
              <Button
                variant="primary"
                size="large"
                style={styles.button}
                onPress={handleResetPassword}
                loading={loading}
              >
                {t('resetPasswordButton')}
              </Button>

              <Button
                variant="outline"
                size="large"
                style={styles.button}
                onPress={handleBackToLogin}
              >
                {t('backToLoginButton')}
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

export default ForgotPasswordScreen; 