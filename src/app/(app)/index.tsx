import React from 'react';
import { Image, StyleSheet, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { MapView } from '@components/MapView';
import { colors } from '@theme/colors';
import { router } from 'expo-router';
import { FlyingPenguin } from '@components/FlyingPenguin';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header with buttons */}
      <View style={styles.header}>
        {/* Tales Button */}
        <TouchableOpacity
          style={styles.taleButton}
          onPress={() => router.push('../tale')}
        >
          <Image
            source={require('@assets/images/tale-icon.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Parental Zone Button */}
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => router.push('/parental-zone')}
        >
          <Image
            source={require('@assets/images/lock-icon.png')}
            style={styles.icon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Map View - takes up remaining space */}
      <View style={styles.mapContainer}>
        <MapView />
      </View>

      {/* Flying Penguin - positioned absolutely above the map */}
      <FlyingPenguin />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary[100],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    zIndex: 10, // Ensure buttons stay above other elements
  },
  taleButton: {
    zIndex: 10,
  },
  settingsButton: {
    zIndex: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
  mapContainer: {
    flex: 1,
    position: 'relative', // Needed for absolute positioning of children
  },
});