import 'react-native-gesture-handler';
import { Slot, useNavigation, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { AuthProvider } from '../providers/AuthProvider';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, ActivityIndicator, AppState } from 'react-native';
import { cleanupAudio, setNavigationState } from '../utils/audio';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { initializeErrorReporting } from '../utils/errorReporting';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Initialize error reporting
initializeErrorReporting({
  enableReporting: !__DEV__, // Only enable in production
  // Add your error reporting service configuration here
  // serviceUrl: 'your-sentry-dsn',
  // apiKey: 'your-api-key',
});

export default function RootLayout() {
  const navigation = useNavigation();
  const pathname = usePathname();
  const [previousPath, setPreviousPath] = useState<string | null>(null);

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

  useEffect(() => {
    if (previousPath) {
      // Check if we're navigating back by comparing path segments
      const currentSegments = pathname.split('/').filter(Boolean);
      const previousSegments = previousPath.split('/').filter(Boolean);
      
      // If current path has fewer segments than previous, we're going back
      const isBack = currentSegments.length < previousSegments.length;
      
      // Special case: if we're going back to root ('/'), it's always a back navigation
      if (pathname === '/') {
        setNavigationState(false);
      } else {
        setNavigationState(isBack);
      }
    }
    setPreviousPath(pathname);
  }, [pathname, previousPath]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background') {
        setNavigationState(false);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (!fontsLoaded || !navigationReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider navigationReady={navigationReady}>
          <Slot />
        </AuthProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}