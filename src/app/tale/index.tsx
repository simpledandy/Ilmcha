import React, { FC, useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { TaleCard } from '@components/TaleCard';
import { Text } from '@components/Text';
import { useTranslation } from 'react-i18next';
import { playAudio } from '@utils/audio';
import { navigate } from '@utils/navigation';
import { tales } from '@constants/tales/tales';

export const StoriesScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  playAudio('welcomeTales');
  const handleSomeNavigation = () => {
    navigate({ name: '/tale' });
  };
  return (
    <ImageBackground
      source={require('@assets/images/backgrounds/stories_bg.png')}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text variant="heading2">{t('welcomeTales')}</Text>
        </View>

        <View style={styles.grid}>
          {tales.map((tale) => (
            <TaleCard
              key={tale.id}
              imageSource={tale.image}
              title={i18n.language === 'uz' ? tale.title.uz : tale.title.en}
              onPress={() =>
                router.push({
                  pathname: '/tale/[tale]',
                  params: { tale: tale.id },
                })
              }
            />
          ))}
        </View>

        <Image
          source={require('@assets/images/penguin/waving-gray.png')}
          style={styles.penguin}
          resizeMode="contain"
        />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  container: { alignItems: 'center', paddingTop: 80, paddingBottom: 100 },
  header: {
    marginBottom: 20,
    backgroundColor: '#ff7043',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  icon: { width: 24, height: 24 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  penguin: {
    width: 200,
    height: 200,
    marginTop: 40,
    marginLeft: 'auto',
  },
});

export default StoriesScreen;