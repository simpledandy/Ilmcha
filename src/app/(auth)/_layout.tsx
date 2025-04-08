import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@hooks/useAuth';
import { Redirect } from 'expo-router';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect href="./(app)" />;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#007AFF',
          },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="welcome" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forgot-password" />
      </Stack>
    </>
  );
} 