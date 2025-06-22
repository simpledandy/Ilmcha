import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, ImageBackground, Modal } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { playAudio, cleanupAudio } from '@/src/utils/audio';
import Text from '@components/Text';
import i18n from 'i18n';
import { TracingScreen } from '@/src/components/TracingScreen';

export default function IslandScreen() {
  const { island } = useLocalSearchParams();
  const { t } = i18n;
  const [isTracing, setIsTracing] = useState(false);
  const [tracingType, setTracingType] = useState<'numbers' | 'letters'>('numbers');

  useEffect(() => {
    playAudio('islandNumeriya');
    return () => {
      cleanupAudio();
    };
  }, []);

  const handlePress = (lessonId: string) => {
    router.push(`/(app)/${island}/${lessonId}`);
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
      {/* Number 1 */}
      <TouchableOpacity style={[styles.lessonButton, { top: '18%', left: '68%' }]} onPress={() => handlePress('1')}>
        <Text variant="heading2" style={styles.lessonText}>1</Text>
      </TouchableOpacity>

      {/* Number 2 */}
      <TouchableOpacity style={[styles.lessonButton, { top: '30%', left: '45%' }]} onPress={() => handlePress('2')}>
        <Text variant="heading2" style={styles.lessonText}>2</Text>
      </TouchableOpacity>

      {/* Number 3 */}
      <TouchableOpacity style={[styles.lessonButton, { top: '40%', left: '65%' }]} onPress={() => handlePress('3')}>
        <Text variant="heading2" style={styles.lessonText}>3</Text>
      </TouchableOpacity>

      {/* Quiz near cave */}
      <TouchableOpacity style={[styles.lessonButton, { top: '50%', left: '10%' }]} onPress={() => handlePress('quiz')}>
        <Text variant="body" style={styles.smallText} numberOfLines={2}>{t('letsCountTogether')}</Text>
      </TouchableOpacity>

      {/* Knowledge chest */}
      <TouchableOpacity style={[styles.lessonButton, { top: '70%', left: '60%' }]} onPress={() => handlePress('box')}>
        <Text variant="body" style={styles.smallText}>{t('knowledgeBox')}</Text>
      </TouchableOpacity>

      {/* Number Tracing Activity */}
      <TouchableOpacity 
        style={[styles.tracingButton, { top: '25%', left: '15%' }]} 
        onPress={() => handleTracingPress('numbers')}
      >
        <Text style={styles.tracingIcon}>✏️</Text>
        <Text variant="body" style={styles.tracingText}>{t('numberTracing')}</Text>
      </TouchableOpacity>

      {/* Letter Tracing Activity */}
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
