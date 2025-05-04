import { playAudio } from '@/src/utils/audio';
import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native';

export default function CountingLesson() {
  playAudio('countingFish');
  return (
    <ImageBackground
      source={require('@assets/images/counting_bg.png')}
      style={styles.background}
    >
      {/* Stars and Buttons */}
      <View style={styles.topBar}>
        <Text style={styles.lessonLabel}>5-DARS</Text>
        <View style={styles.stars}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.star}>⭐</Text>
        </View>
        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.nextButtonText}>KEYINGISI</Text>
        </TouchableOpacity>
      </View>

      {/* Penguin and Instruction */}
      <View style={styles.centerArea}>
        {}
        <Image
          source={require('@assets/images/penguin/waving-explorer.png')}
          style={styles.penguin}
          resizeMode="contain"
        />
      </View>

      {/* Bottom chest */}
      <View style={styles.bottomArea}>
        <Image
          source={require('@assets/images/chest.png')}
          style={styles.chest}
          resizeMode="contain"
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 40,
    alignItems: 'center',
  },
  lessonLabel: {
    fontSize: 18,
    backgroundColor: '#fff0b3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    fontWeight: 'bold',
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 20,
  },
  nextButton: {
    backgroundColor: '#ffcc80',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  nextButtonText: {
    fontWeight: 'bold',
  },
  centerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instruction: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  penguin: {
    width: 150,
    height: 150,
  },
  bottomArea: {
    alignItems: 'center',
    marginBottom: 30,
  },
  chest: {
    width: 80,
    height: 80,
  },
});
