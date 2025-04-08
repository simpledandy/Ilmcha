import 'react-native-gesture-handler';
import { Slot } from 'expo-router';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { AuthProvider } from '@providers/AuthProvider';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
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

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}