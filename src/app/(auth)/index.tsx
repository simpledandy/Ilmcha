import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { AppText } from '@components/AppText';
import { AppButton } from '@components/AppButton';
import { AppImage } from '@components/AppImage';
import { i18n } from '@i18n';
import { BackgroundImages, PenguinImages } from '@/src/constants';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  console.log("Rendering WelcomeScreen");
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  const changeLanguage = (lng: 'en' | 'uz' | 'ru') => {
    i18n.changeLanguage(lng).then(() => {
      setCurrentLanguage(lng);
    });
  };

  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLanguage(i18n.language);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  return (
    <ImageBackground
      source={BackgroundImages.auth.white}
      style={[styles.container, { width, height }]}
    >
      {/* Content Container */}
      <View style={styles.content}>
        {/* Language Selector */}
        <View style={styles.languageSelector}>
          <Pressable
            onPress={() => changeLanguage('uz')}
            style={[styles.languageButton, currentLanguage === 'uz' && styles.activeLanguage]}
          >
            <AppText style={styles.languageText}>{i18n.t('languageUzbek', { defaultValue: 'O\'zbekcha' })}</AppText>
          </Pressable>
          <Pressable
            onPress={() => changeLanguage('en')}
            style={[styles.languageButton, currentLanguage === 'en' && styles.activeLanguage]}
          >
            <AppText style={styles.languageText}>{i18n.t('languageEnglish', { defaultValue: 'English' })}</AppText>
          </Pressable>
          <Pressable
            onPress={() => changeLanguage('ru')}
            style={[styles.languageButton, currentLanguage === 'ru' && styles.activeLanguage]}
          >
            <AppText style={styles.languageText}>{i18n.t('languageRussian', { defaultValue: 'Русский' })}</AppText>
          </Pressable>
        </View>

        {/* Text Section */}
        <View style={styles.textSection}>
          <AppText variant="heading1" style={styles.title}>
            {i18n.t('welcome')}
          </AppText>
          <AppText variant="body" style={styles.subtitle}>
            {i18n.t('welcomeSubtitle')}
          </AppText>
        </View>

        {/* Image Section */}
        <View style={styles.imageSection}>
          <AppImage
            source={PenguinImages.poses.wavingPink}
            style={styles.welcomeImage}
            contentFit="contain"
          />
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonSection}>
          <AppButton
            variant="primary"
            size="large"
            style={styles.button}
            onPress={handleLogin}
          >
            {i18n.t('login')}
          </AppButton>

          <AppButton
            variant="secondary"
            size="large"
            style={styles.button}
            onPress={handleSignup}
          >
            {i18n.t('signup')}
          </AppButton>
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
    padding: 20,
  },
  languageSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  languageButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginHorizontal: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  activeLanguage: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'white',
  },
  languageText: {
    color: 'white',
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
  buttonSection: {
    paddingBottom: 40,
  },
  welcomeImage: {
    width: '90%',
    height: '90%',
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
  button: {
    marginBottom: 16,
  },
});