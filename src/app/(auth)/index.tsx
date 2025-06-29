import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import Text from '@components/Text';
import Button from '@components/Button';
import Images from '@constants/images';
import i18n from 'i18n';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignup = () => {
    router.push('/signup');
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
  }, []);

  return (
    <ImageBackground
      source={Images.backgrounds.auth.white}
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
            {i18n.t('welcome')}
          </Text>
          <Text variant="body" style={styles.subtitle}>
            {i18n.t('welcomeSubtitle')}
          </Text>
        </View>

        {/* Image Section */}
        <View style={styles.imageSection}>
          <Image
            source={Images.penguin.poses.wavingPink}
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
            {i18n.t('login')}
          </Button>

          <Button
            variant="outline"
            size="large"
            style={styles.button}
            onPress={handleSignup}
          >
            {i18n.t('signup')}
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