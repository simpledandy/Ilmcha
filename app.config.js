// Add dotenv support for Expo env variables
import 'dotenv/config';

export default {
  expo: {
    name: 'Ilmcha',
    slug: 'Ilmcha',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'ilmcha',
    // Deep linking configuration for email confirmation and password reset
    linking: {
      prefixes: ['ilmcha://'],
      config: {
        screens: {
          'email-confirmation': 'email-confirmation',
          'reset-password': 'reset-password',
        },
      },
    },
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
      },
      package: 'com.simpledandy.Ilmcha'
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png'
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          'image': './assets/images/splash-icon.png',
          'contentFit': 'cover'
        }
      ],
      'expo-localization'
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: '7d4e1f7d-012f-4b01-a3f7-eaa0ed67c5c7'
      },
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
}; 