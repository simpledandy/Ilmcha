import React, { FC, useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, ImageBackground, Modal } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Text } from '@components/Text';
import { useTranslation } from 'react-i18next';
import { TracingScreen } from '@components/TracingScreen';
import { useAudioPlayer } from '@hooks/useAudioPlayer';
import { navigate } from '@utils/navigation';
import { islands } from '@constants/map/mapData';
import { lessons } from '@constants/lessons/lessons';

export const IslandScreen: React.FC = () => {
  const { island } = useLocalSearchParams();
  const { t } = useTranslation();
  const [isTracing, setIsTracing] = useState(false);
  const [tracingType, setTracingType] = useState<'numbers' | 'letters'>('numbers');

  const islandId = typeof island === 'string' ? island : '';
  const currentIsland = islands.find((i) => i.id === islandId);

  // Play intro audio on mount
  useAudioPlayer('islandNumeriya', { autoPlay: true });

  const handleLessonPress = (lessonId: string) => {
    navigate({ name: '/(app)/[island]/[lesson]', params: { island: islandId, lesson: lessonId } });
  };

  const handleTracingPress = (type: 'numbers' | 'letters') => {
    setTracingType(type);
    setIsTracing(true);
  };

  return (
    <ImageBackground
      source={require('@/assets/images/island.png')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Dynamically render lesson buttons */}
      {currentIsland?.lessons?.map((lessonId, idx) => {
        const lesson = lessons[lessonId as keyof typeof lessons];
        if (!lesson) return null;
        return (
          <TouchableOpacity
            key={lessonId}
            style={[styles.lessonButton, { top: `${20 + idx * 10}%`, left: `${30 + (idx % 3) * 20}%` }]}
            onPress={() => handleLessonPress(lessonId)}
          >
            <Text variant="heading2" style={styles.lessonText}>{lesson.title}</Text>
          </TouchableOpacity>
        );
      })}

      {/* Quiz near cave */}
      <TouchableOpacity style={[styles.lessonButton, { top: '50%', left: '10%' }]} onPress={() => handleLessonPress('quiz')}>
        <Text variant="body" style={styles.smallText} numberOfLines={2}>{t('letsCountTogether')}</Text>
      </TouchableOpacity>

      {/* Knowledge chest */}
      <TouchableOpacity style={[styles.lessonButton, { top: '70%', left: '60%' }]} onPress={() => handleLessonPress('box')}>
        <Text variant="body" style={styles.smallText}>{t('knowledgeBox')}</Text>
      </TouchableOpacity>

      {/* Tracing Activities (optional, can be removed if now handled as lessons) */}
      <TouchableOpacity 
        style={[styles.tracingButton, { top: '25%', left: '15%' }]} 
        onPress={() => handleTracingPress('numbers')}
      >
        <Text style={styles.tracingIcon}>✏️</Text>
        <Text variant="body" style={styles.tracingText}>{t('numberTracing')}</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.tracingButton, { top: '60%', left: '25%' }]} 
        onPress={() => handleTracingPress('letters')}
      >
        <Text style={styles.tracingIcon}>📝</Text>
        <Text variant="body" style={styles.tracingText}>{t('letterTracing')}</Text>
      </TouchableOpacity>
      <Modal visible={isTracing} animationType="slide">
        <TracingScreen 
          category={tracingType === 'numbers' ? 'number' : 'letter'} 
          language="en" 
          onClose={() => setIsTracing(false)} 
        />
      </Modal>
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
    color: '#000',
  },
  smallText: {
    color: '#333',
  },
  tracingButton: {
    position: 'absolute',
    padding: 12,
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 80,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tracingIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  tracingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default IslandScreen;
