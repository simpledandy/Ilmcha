import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { tales } from '@constants/tales';
import i18n from 'i18n';

export default function TaleScreen() {
  const { tale } = useLocalSearchParams<{ tale: string }>();
  const story = tales.find((t) => t.id === tale);

  if (!story) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          {i18n.t('taleNotFound', { defaultValue: 'Tale not found' })}
        </Text>
      </View>
    );
  }

  const title = i18n.language === 'uz' ? story.title.uz : story.title.en;
  const text = i18n.language === 'uz' ? story.text.uz : story.text.en;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={story.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{text}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fffaf5',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#3b3b3b',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    textAlign: 'justify',
  },
});