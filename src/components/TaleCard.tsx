// components/TaleCard.js
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Text } from './Text';

interface TaleCardProps {
  imageSource: any;
  title: string;
  onPress: () => void;
  style?: ViewStyle;
}

export const TaleCard: React.FC<TaleCardProps> = ({ imageSource, title, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress}>
      <Image source={imageSource} style={styles.image} resizeMode="cover" />
      <Text variant="label" style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

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
