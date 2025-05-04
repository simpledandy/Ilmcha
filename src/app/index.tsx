import { Redirect } from 'expo-router';
import { useAuth } from '@hooks/useAuth';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Wait for auth state to be determined
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Redirect based on auth state
  return <Redirect href={isAuthenticated ? "/(app)" : "/(auth)"} />;
}
