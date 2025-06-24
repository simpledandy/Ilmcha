import React, { FC } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';
import { router } from 'expo-router';

export const Index: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? "/(app)" : "/(auth)"} />;
}

export default Index;