import React from 'react';
import { Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { MapView } from '@components/MapView';
import { colors } from '@theme/colors';
import { Ionicons } from '@expo/vector-icons'; // Ensure you have @expo/vector-icons installed
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Tales Part */}
      <TouchableOpacity
        style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}
        onPress={() => router.push('../tale')}
      >
        <Image
          source={require('@assets/images/tale-icon.png')}
          style={{ width: 40, height: 40 }}
          resizeMode="contain"
        />
      </TouchableOpacity> 


      {/* Settings Icon */}
      <TouchableOpacity
        style={styles.settingsIcon}
        onPress={() => router.push('/(app)/parental-zone')}
      >
        <Image
          source={require('@assets/images/lock-icon.png')}
          style={{ width: 40, height: 40 }}
          resizeMode="contain"
        />
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
