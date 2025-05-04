import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

const lessons = [
  { id: '1', label: '1' },
  { id: '2', label: '2' },
  { id: '3', label: '3' },
  { id: 'quiz', label: 'Raqamlar testi' },
  { id: 'box', label: 'Bilimlar sandigʻi' },
];

export default function IslandScreen() {
  const { island } = useLocalSearchParams();

  const handlePress = (lessonId: string) => {
    router.push(`/(app)/${island}/${lessonId}`);
  };

  return (
    <ImageBackground
      source={require('@/assets/images/island.png')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Number 1 */}
      <TouchableOpacity style={[styles.lessonButton, { top: '18%', left: '68%' }]} onPress={() => handlePress('1')}>
        <Text style={styles.lessonText}>1</Text>
      </TouchableOpacity>

      {/* Number 2 */}
      <TouchableOpacity style={[styles.lessonButton, { top: '30%', left: '45%' }]} onPress={() => handlePress('2')}>
        <Text style={styles.lessonText}>2</Text>
      </TouchableOpacity>

      {/* Number 3 */}
      <TouchableOpacity style={[styles.lessonButton, { top: '40%', left: '65%' }]} onPress={() => handlePress('3')}>
        <Text style={styles.lessonText}>3</Text>
      </TouchableOpacity>

      {/* Quiz near cave */}
      <TouchableOpacity style={[styles.lessonButton, { top: '50%', left: '10%' }]} onPress={() => handlePress('quiz')}>
        <Text style={styles.smallText} numberOfLines={2}>Keling birga sanaymiz!</Text>
      </TouchableOpacity>

      {/* Knowledge chest */}
      <TouchableOpacity style={[styles.lessonButton, { top: '70%', left: '60%' }]} onPress={() => handlePress('box')}>
        <Text style={styles.smallText}>Sandıq</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  lessonButton: {
    position: 'absolute',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
  },
  lessonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  smallText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
