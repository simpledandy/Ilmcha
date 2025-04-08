import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function LessonScreen() {
  const { island, lesson } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Lesson {lesson} on {island} Island
      </Text>
      {/* Add lesson content here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});