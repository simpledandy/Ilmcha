import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

const lessons = [
  { id: '1', title: 'Lesson 1' },
  { id: '2', title: 'Lesson 2' },
];

export default function IslandScreen() {
  const { island } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {lessons.map((lesson) => (
        <Button
          key={lesson.id}
          title={lesson.title}
          onPress={() => router.push(`/(app)/${island}/${lesson.id}` as const)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});