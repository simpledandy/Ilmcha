import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { tales } from '@constants/tales';
import TaleCard from '@components/TaleCard';
import i18n from 'i18n';

export default function StoriesScreen() {
  const { t } = i18n;

  return (
    <ImageBackground
      source={require('@assets/images/backgrounds/stories_bg.png')}
      style={styles.background}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{t('welcomeTales')}</Text>
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