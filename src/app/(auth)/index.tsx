import React, { FC, useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Pressable,
} from 'react-native';
import { navigate } from '@utils/navigation';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { useTranslation } from 'react-i18next';
import { BackgroundImages, PenguinImages } from '@constants/images/images';

const { width, height } = Dimensions.get('window');

export const WelcomeScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const handleLogin = () => {
    navigate({ name: '/login' });
  };

  const handleSignup = () => {
    navigate({ name: '/signup' });
  };

  const changeLanguage = (lng: 'en' | 'uz') => {
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
  }, [i18n]);

  return (
    <ImageBackground
      source={BackgroundImages.auth.white}
      style={styles.container}
    >
      {/* Content Container */}
      <View style={styles.content}>
        {/* Language Selector */}
        <View style={styles.languageSelector}>
          <Pressable
            onPress={() => changeLanguage('uz')}
            style={[styles.languageButton, currentLanguage === 'uz' && styles.activeLanguage]}
          >
            <Text style={styles.languageText}>O'zbekcha</Text>
          </Pressable>
          <Pressable
            onPress={() => changeLanguage('en')}
            style={[styles.languageButton, currentLanguage === 'en' && styles.activeLanguage]}
          >
            <Text style={styles.languageText}>English</Text>
          </Pressable>
        </View>

        {/* Text Section */}
        <View style={styles.textSection}>
          <Text variant="heading1" style={styles.title}>
            {t('welcome')}
          </Text>
          <Text variant="body" style={styles.subtitle}>
            {t('welcomeSubtitle')}
          </Text>
        </View>

        {/* Image Section */}
        <View style={styles.imageSection}>
          <Image
            source={PenguinImages.poses.wavingPink}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonSection}>
          <Button
            variant="primary"
            size="large"
            style={styles.button}
            onPress={handleLogin}
          >
            {t('login')}
          </Button>

          <Button
            variant="outline"
            size="large"
            style={styles.button}
            onPress={handleSignup}
          >
            {t('signup')}
          </Button>
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

export default WelcomeScreen;