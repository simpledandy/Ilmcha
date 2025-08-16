import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { AppText } from '@components/AppText';
import { AppButton } from '@components/AppButton';
import { AppImage } from '@components/AppImage';
import { router } from 'expo-router';
import { i18n } from 'i18n';
import { PenguinImages } from '@/src/constants';

const { width } = Dimensions.get('window');

export default function ReportsScreen() {
  return (
    <View style={styles.container}>
      <AppButton
        variant="secondary"
        size="small"
        onPress={() => router.back()}
        style={styles.backButton}
      >
        {i18n.t('back')}
      </AppButton>

      <AppText variant="heading1" style={styles.title}>
        {i18n.t('reports')}
      </AppText>

      <View style={styles.profileCircle}>
        <AppImage source={PenguinImages.poses.wavingPink} style={styles.avatar} />
      </View>

      <View style={styles.reportBox}>
        <AppText variant="body" style={styles.label}>
          {i18n.t('letters')}:
        </AppText>
        <AppText variant="body" style={styles.value}>
          78%
        </AppText>
      </View>

      <View style={styles.reportBox}>
        <AppText variant="body" style={styles.label}>
          {i18n.t('numbers')}:
        </AppText>
        <AppText variant="body" style={styles.value}>
          94%
        </AppText>
      </View>

      <View style={styles.reportBox}>
        <AppText variant="body" style={styles.label}>
          {i18n.t('totalPoints')}:
        </AppText>
        <AppText variant="body" style={styles.value}>
          200 🪙
        </AppText>
      </View>

      <View style={styles.reportBox}>
        <AppText variant="body" style={styles.label}>
          {i18n.t('overallResult')}:
        </AppText>
        <AppText variant="body" style={styles.value}>
          86%
        </AppText>
      </View>
      <AppImage source={require('@assets/images/cloud-left.png')} style={[styles.cloud, { left: 0, width: width * 0.4 }]} />
      <AppImage source={require('@assets/images/cloud-right.png')} style={[styles.cloud, { right: 0, width: width * 0.4 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1d99ed',
    alignItems: 'center',
    paddingTop: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 10,
  },
  title: {
    marginBottom: 20,
    color: '#2F2FA2',
  },
  profileCircle: {
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'purple',
    padding: 6,
    backgroundColor: '#fff',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
  },
  reportBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    width: '85%',
    padding: 16,
    borderRadius: 40,
    marginBottom: 12,
  },
  label: {
    color: '#2F2FA2',
  },
  value: {
    fontWeight: 'bold',
  },
  cloud: {
    position: 'absolute',
    bottom: 0,
    zIndex: -1,
  },
});