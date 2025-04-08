import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@components/Text';
import { Button } from '@components/Button';
import { useAuth } from '@hooks/useAuth';
import { colors } from '@theme/colors';

export default function ProfileScreen() {
  const { logout, user } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="heading1">Profil</Text>
        {user && (
          <>
            <Text variant="body" style={styles.email}>{user.email}</Text>
          </>
        )}
      </View>

      <Button 
        onPress={logout}
        variant="secondary"
        style={styles.logoutButton}
      >
        <Text>Chiqish</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  email: {
    marginTop: 10,
    color: colors.text.secondary,
  },
  logoutButton: {
    marginBottom: 20,
  },
}); 