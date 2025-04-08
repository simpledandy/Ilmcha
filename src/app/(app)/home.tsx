import React from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { MapView } from '@components/MapView';
import { colors } from '@theme/colors';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have @expo/vector-icons installed
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Settings Icon */}
      <TouchableOpacity
        style={styles.settingsIcon}
        onPress={() => router.push('/(app)/parental-zone')}
      >
        <Ionicons name="settings-outline" size={28} color={colors.primary[900]} />
      </TouchableOpacity>

      {/* Map View */}
      <MapView />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary[100],
  },
  settingsIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
  },
});
