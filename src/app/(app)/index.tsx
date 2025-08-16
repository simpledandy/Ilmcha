// src/app/(app)/index.tsx
import React, {  } from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import { colors } from '@theme/colors';
import { router } from 'expo-router';
import { FlyingPenguin, OceanMap } from '@components';
import { i18n } from 'i18n';
import { IconButton } from '@/src/components/IconButton';
import { AppIcons } from '@/src/constants';

export default function HomeScreen() {
  const { t } = i18n;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with buttons */}
      <View style={styles.header}>
        {/* Tales Button */}
        <IconButton
          style={styles.taleButton}
          onPress={() => router.push('../tale')}
          icon={AppIcons.taleIcon}
        />

        {/* Parental Zone Button */}
        <IconButton
          style={styles.settingsButton}
          onPress={() => router.push('/parental-zone')}
          icon={AppIcons.lockIcon}
        />
      </View>
      {/* Map View - takes up remaining space */}
      <View style={styles.mapContainer}>
        <OceanMap />
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
    alignItems: 'center',
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