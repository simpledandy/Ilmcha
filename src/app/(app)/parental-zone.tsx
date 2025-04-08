import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '@hooks/useAuth';
import { colors } from '@theme/colors';

export default function ParentalZoneScreen() {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parental Zone</Text>
      <Button title="Logout" onPress={logout} color={colors.primary[900]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary[100],
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.primary[900],
  },
});