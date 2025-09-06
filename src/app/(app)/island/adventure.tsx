// src/app/(app)/island/adventure.tsx
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@theme/colors';
import { Intro, Tracing, Arranging, CelebrationOverlay } from '@components';
import { ParticleShape } from '@components/CelebrationOverlay';
import { useProgress } from '@/src/hooks/useProgress';
import { getNextTopic } from '@/src/utils/islands';
import { IslandId } from '@/src/types/common';

export default function AdventureScreen() {
  const { island, topic } = useLocalSearchParams<{ island: IslandId; topic: string }>();
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [celebrating, setCelebrating] = useState(false);

  const { unlockTopic } = useProgress(island);
  const steps = [Intro, Tracing, Arranging];
  const shapes: ParticleShape[] = ['circle', 'square', 'triangle', 'diamond', 'star'];

  const goNext = () => setCelebrating(true);

  const handleCelebrationFinish = async () => {
    setCelebrating(false);

    if (stepIndex + 1 < steps.length) {
      // Still have steps → go to next
      setStepIndex((i) => i + 1);
    } else {
      // All steps done → unlock next topic or finish island
      const next = getNextTopic(island, topic);
      if (next) {
        await unlockTopic(next);
        /*router.replace({
          pathname: '../island/',
          params: { island, topic: next },
        });*/
        router.back(); // Go back to island screen
      } else {
        // No next → return to island map
        router.replace({ pathname: '../island', params: { island } });
      }
    }
  };

  const Step = steps[stepIndex];
  return (
    <View style={styles.container}>
      {stepIndex < steps.length && (
        <Step islandId={island} topic={topic} onComplete={goNext} />
      )}
      {celebrating && (
        <CelebrationOverlay
          onFinish={handleCelebrationFinish}
          shape={shapes[stepIndex % shapes.length]} // cycle safely
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary[300] },
});
