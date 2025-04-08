import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { router } from 'expo-router';
import Text from '@components/Text';
import Button from '@components/Button';
import Images from '@constants/images';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignup = () => {
    router.push('/signup');
  };

  return (
    <ImageBackground
      source={Images.backgrounds.auth.white}
      style={styles.container}
    >
      {/* Content Container */}
      <View style={styles.content}>
        {/* Text Section */}
        <View style={styles.textSection}>
          <Text variant="heading1" style={styles.title}>
            Ilmchaga xush kelibsiz!
          </Text>
          <Text variant="body" style={styles.subtitle}>
            Farzandingiz uchun eng yaxshi o'quv platforma
          </Text>
        </View>

        {/* Image Section */}
        <View style={styles.imageSection}>
          <Image
            source={Images.penguin.poses.welcomingPink}
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
            Akkauntim bor
          </Button>

          <Button
            variant="outline"
            size="large"
            style={styles.button}
            onPress={handleSignup}
          >
            Akkaunt yaratish
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
  textSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60, // Add some padding from the top
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