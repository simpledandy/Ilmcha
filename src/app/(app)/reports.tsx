import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import Text from '@components/Text';
import Button from '@components/Button';
import Images from '@constants/images';
import { router } from 'expo-router';
import i18n from 'i18n';

const { width } = Dimensions.get('window');

export default function ReportsScreen() {
  return (
    <View style={styles.container}>
      <Button
        variant="outline"
        size="small"
        onPress={() => router.back()}
        style={styles.backButton}
      >
        {i18n.t('back')}
      </Button>

      <Text variant="heading1" style={styles.title}>
        {i18n.t('reports')}
      </Text>

      <View style={styles.profileCircle}>
        <Image source={require('@assets/images/girl-avatar.png')} style={styles.avatar} />
      </View>

      <View style={styles.reportBox}>
        <Text variant="body" style={styles.label}>
          {i18n.t('letters')}:
        </Text>
        <Text variant="body" style={styles.value}>
          78%
        </Text>
      </View>

      <View style={styles.reportBox}>
        <Text variant="body" style={styles.label}>
          {i18n.t('numbers')}:
        </Text>
        <Text variant="body" style={styles.value}>
          94%
        </Text>
      </View>

      <View style={styles.reportBox}>
        <Text variant="body" style={styles.label}>
          {i18n.t('totalPoints')}:
        </Text>
        <Text variant="body" style={styles.value}>
          200 🪙
        </Text>
      </View>

      <View style={styles.reportBox}>
        <Text variant="body" style={styles.label}>
          {i18n.t('overallResult')}:
        </Text>
        <Text variant="body" style={styles.value}>
          86%
        </Text>
      </View>
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
});