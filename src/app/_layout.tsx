import 'react-native-gesture-handler';
import { Slot, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { AuthProvider } from '@providers/AuthProvider';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, ActivityIndicator } from 'react-native';
import { stopAudio } from '@utils/audio';
// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    // Regular Sono variants
    'Sono-Regular': require('@assets/fonts/Sono-Regular.ttf'),
    'Sono-Light': require('@assets/fonts/Sono-Light.ttf'),
    'Sono-ExtraLight': require('@assets/fonts/Sono-ExtraLight.ttf'),
    'Sono-Medium': require('@assets/fonts/Sono-Medium.ttf'),
    'Sono-SemiBold': require('@assets/fonts/Sono-SemiBold.ttf'),
    'Sono-Bold': require('@assets/fonts/Sono-Bold.ttf'),
    'Sono-ExtraBold': require('@assets/fonts/Sono-ExtraBold.ttf'),
    
    // Proportional variants
    'Sono_Proportional-Regular': require('@assets/fonts/Sono_Proportional-Regular.ttf'),
    'Sono_Proportional-Light': require('@assets/fonts/Sono_Proportional-Light.ttf'),
    'Sono_Proportional-ExtraLight': require('@assets/fonts/Sono_Proportional-ExtraLight.ttf'),
    'Sono_Proportional-Medium': require('@assets/fonts/Sono_Proportional-Medium.ttf'),
    'Sono_Proportional-SemiBold': require('@assets/fonts/Sono_Proportional-SemiBold.ttf'),
    'Sono_Proportional-Bold': require('@assets/fonts/Sono_Proportional-Bold.ttf'),
    'Sono_Proportional-ExtraBold': require('@assets/fonts/Sono_Proportional-ExtraBold.ttf'),
  });

  const [navigationReady, setNavigationReady] = useState(false);
  useEffect(() => {
    if (fontsLoaded) {
      setNavigationReady(true);
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  // Add cleanup effect
  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      stopAudio();
    });

    return () => {
      unsubscribe();
      stopAudio();
    };
  }, [navigation]);

  if (!fontsLoaded || !navigationReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider navigationReady={navigationReady}>
        <Slot />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}