// components/TaleCard.js
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { playAudio } from '../utils/audio';
import Text from './Text';

export default function TaleCard({ imageSource, title, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={imageSource} style={styles.image} resizeMode="cover" />
      <Text variant="caption" style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    margin: 10,
    alignItems: 'center',
  },
  image: {
    width: 140,
    height: 100,
    borderRadius: 12,
  },
  title: {
    marginTop: 5,
    color: '#fff',
    backgroundColor: '#00c853',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
    textAlign: 'center',
  },
});
