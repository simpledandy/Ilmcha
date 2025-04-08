import { Slot, Tabs } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/src/providers/AuthProvider';

export default function AppLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </GestureHandlerRootView>
  );

} 