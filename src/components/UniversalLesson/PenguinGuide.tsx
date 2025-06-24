import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Animated from 'react-native-reanimated';
import { PenguinImages } from '@constants/images/images';

export interface PenguinGuideProps {
  pose: string;
}

export const PenguinGuide: React.FC<PenguinGuideProps> = ({ pose }) => (
  <View style={styles.penguinContainer}>
    <Animated.Image
      source={require('@assets/images/penguin/' + (pose || 'waving-explorer') + '.png')}
      style={styles.penguin}
      resizeMode="contain"
    />
  </View>
);

const styles = StyleSheet.create({
  penguinContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center', zIndex: 10 },
  penguin: { width: 120, height: 120 },
}); 