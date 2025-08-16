
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import ErrorBoundary from '../components/ErrorBoundary';
import { View, Text, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const [loaded] = useFonts({
    'Fredoka-Regular': require('../../assets/fonts/Fredoka-Regular.ttf'),
    'Fredoka-Medium': require('../../assets/fonts/Fredoka-Medium.ttf'),
    'Fredoka-SemiBold': require('../../assets/fonts/Fredoka-SemiBold.ttf'),
    'Fredoka-Bold': require('../../assets/fonts/Fredoka-Bold.ttf'),
    'Fredoka-Light': require('../../assets/fonts/Fredoka-Light.ttf'),
  });

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <StatusBar style="auto" />
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 16, color: '#007AFF', fontSize: 18 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
      <StatusBar style="auto" />
    </ErrorBoundary>
  );
}
