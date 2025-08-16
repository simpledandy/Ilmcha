import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { AppText } from '@components/AppText';
import { AppButton } from '@components/AppButton';
import { AppImage } from '@components/AppImage';
import { useAuth } from '@hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { supabase } from '@utils/supabaseClient';
import { useLocalSearchParams } from 'expo-router';
import { BackgroundImages, PenguinImages } from '@/src/constants';

const { width, height } = Dimensions.get('window');

export default function EmailConfirmationScreen() {
  const { t } = useTranslation();
  const { user, createParentRecord } = useAuth();
  const params = useLocalSearchParams();
  const [confirmed, setConfirmed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  // Confetti is always shown when confirmed, so showConfetti state is not needed
  const confettiAnim = useRef(new Animated.Value(0)).current;
  const pollInterval = useRef<number | null>(null);

  useEffect(() => {
    console.log('🟢 [EmailConfirmation] Mounted. Query params:', params);
    if (confirmed) return;
    setChecking(true);
    const poll = async () => {
      console.log('🔄 [EmailConfirmation] Polling for confirmation...');
      try {
        const { data, error } = await supabase.auth.refreshSession();
        if (error) throw error;
        if (data.session?.user?.email_confirmed_at) {
          console.log('✅ [EmailConfirmation] Email confirmed!');
          setConfirmed(true);
          setChecking(false);
        }
      } catch (err) {
        console.log('❌ [EmailConfirmation] Polling error:', err);
        setError(t('emailCheckError'));
        setChecking(false);
      }
    };
    poll();
    pollInterval.current = setInterval(poll, 5000) as unknown as number;
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [confirmed, t, params]);

  // On confirmation, create parent record, show confetti, and navigate
  useEffect(() => {
    if (!confirmed) return;
    const celebrateAndProceed = async () => {
      console.log('🎉 [EmailConfirmation] Showing confetti and creating parent record...');
      try {
        const result = await createParentRecord();
        if (result.success) {
          Animated.timing(confettiAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }).start();
          setTimeout(() => {
            console.log('➡️ [EmailConfirmation] Navigating to onboarding...');
            router.replace('/(app)/onboarding');
          }, 2500);
        } else {
          console.log('❌ [EmailConfirmation] Parent record error:', result.error);
          setError(result.error || t('parentRecordError'));
        }
      } catch (err) {
        console.log('❌ [EmailConfirmation] Exception:', err);
        setError(t('parentRecordError'));
      }
      // Do not setChecking here, let polling effect manage it
    };
    celebrateAndProceed();
  }, [confirmed, createParentRecord, confettiAnim, t]);

  // Fallback if confirmation takes too long
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!confirmed) {
        console.log('⏰ [EmailConfirmation] Confirmation timeout reached.');
        setError(
          t('emailConfirmationTimeout', {
            defaultValue: 'Still waiting for confirmation? Please check your spam folder or try signing up again.'
          })
        );
      }
    }, 300000); // 5 minutes
    return () => clearTimeout(timeout);
  }, [confirmed, t]);

  return (
    <ImageBackground
      source={BackgroundImages.auth.blue}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Emergency Back to Login */}
        <View style={styles.topRight}>
          <AppButton
            variant="secondary"
            size="small"
            style={styles.backButton}
            onPress={() => router.replace('/(auth)/login')}
          >
            {t('backToLogin')}
          </AppButton>
        </View>
        {/* Penguin and message */}
        <View style={styles.centerSection}>
          <AppImage
            source={PenguinImages.poses.wavingPink}
            style={styles.welcomeImage}
            contentFit="contain"
          />
          {!confirmed && (
            <AppText variant="heading2" style={styles.title}>
              {t('checkYourEmail')}
            </AppText>
          )}
          {!confirmed && (
            <AppText variant="body" style={styles.subtitle}>
              {t('emailConfirmationMessage', { email: user?.email || 'your email' })}
            </AppText>
          )}
          {checking && !confirmed && (
            <AppText style={styles.waitingText}>{t('loading')}</AppText>
          )}
          {error && !confirmed && (
            <AppText style={styles.errorText}>{error}</AppText>
          )}
          {confirmed && (
            <>
              {/* Confetti placeholder */}
              <Animated.View style={[styles.confetti, { opacity: confettiAnim }]}> 
                <AppText style={styles.confettiText}>🎉🎊</AppText>
              </Animated.View>
              <AppText variant="heading2" style={styles.congratsTitle}>
                {t('congrats', { defaultValue: 'Congratulations!' })}
              </AppText>
              <AppText variant="body" style={styles.congratsSubtitle}>
                {t('accountCreated', { defaultValue: 'Your account is ready! Let’s set up your child’s profile.' })}
              </AppText>
            </>
          )}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  topRight: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 2,
  },
  backButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  welcomeImage: {
    width: width * 0.5,
    height: height * 0.2,
    marginBottom: 24,
  },
  title: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 16,
    maxWidth: 320,
  },
  waitingText: {
    color: 'white',
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    color: '#EF4444',
    marginTop: 12,
    textAlign: 'center',
    maxWidth: 320,
  },
  confetti: {
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confettiText: {
    fontSize: 48,
    textAlign: 'center',
  },
  congratsTitle: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 28,
  },
  congratsSubtitle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 8,
    maxWidth: 320,
  },
}); 