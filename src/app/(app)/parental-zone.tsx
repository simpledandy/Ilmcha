import React from 'react';
import { View, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import Text from '@components/Text';
import Button from '@components/Button';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const dummyChildren = [
  { id: '1', avatar: require('@assets/images/boy-avatar.png') },
  { id: '2', avatar: require('@assets/images/girl-avatar.png') },
  { id: '3', avatar: require('@assets/images/add-icon.png') },
];

export default function ParentalZoneScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image source={require('@assets/images/backgrounds/auth/white.png')} style={styles.bgTop} />

      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text variant="heading1" weight="bold" style={styles.title}>
          {t('parentalZoneTitle')}
        </Text>
        <TouchableOpacity onPress={() => {
            router.push('/settings');
          }}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.swiperContainer}>
        <FlatList
          horizontal
          data={dummyChildren}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.avatarWrapper}>
              <Image source={item.avatar} style={styles.avatar} />
            </View>
          )}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <Button>{t('reports')}</Button>
        <Button>{t('blockFunctions')}</Button>
        <Button>{t('screenTime')}</Button>
        <Button>{t('otherDevices')}</Button>
      </View>

      <Image source={require('@assets/images/cloud-left.png')} style={styles.cloudLeft} />
      <Image source={require('@assets/images/cloud-right.png')} style={styles.cloudRight} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6EFFF',
    alignItems: 'center',
    paddingTop: 50,
  },
  bgTop: {
    position: 'absolute',
    top: 0,
    width: '100%',
    resizeMode: 'cover',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    color: '#000',
  },
  swiperContainer: {
    height: 100,
    marginBottom: 20,
  },
  avatarWrapper: {
    marginHorizontal: 10,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  avatar: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  buttonsContainer: {
    width: '85%',
    gap: 12,
  },
  cloudLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width * 0.4,
    resizeMode: 'contain',
  },
  cloudRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: width * 0.4,
    resizeMode: 'contain',
  },
});
