import React from 'react';
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../hooks/useAuth';
import { Redirect } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { useSegments } from 'expo-router';

export default function AuthLayout() {
  // Just show the auth screens if navigated to, no redirects or blocking
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { flex: 1, backgroundColor: '#007AFF' },
        }}
      >
        <Stack.Screen name="/" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="email-confirmation" />
      </Stack>
    </>
  );
}