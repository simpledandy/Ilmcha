import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import Animated, { useSharedValue, withSpring, withSequence, withDelay, useAnimatedStyle } from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';

const { width } = Dimensions.get('window');

type SequencingItem = {
  id: string;
  label: string;
  color: string;
};

interface SequencingProps {
  items: SequencingItem[]; // shuffled
  correctOrder: string[];  // array of ids in correct order
}

export const Sequencing: React.FC<SequencingProps> = ({
  items,
  correctOrder
}) => {
  const [sequence, setSequence] = useState<SequencingItem[]>(items);
  const [selected, setSelected] = useState<SequencingItem[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  const scaleAnim = useSharedValue(1);

  const checkAnswer = () => {
    const selectedIds = selected.map(s => s.id);
    if (JSON.stringify(selectedIds) === JSON.stringify(correctOrder)) {
      // Correct
      setShowConfetti(true);
      scaleAnim.value = withSequence(
        withSpring(1.2, { damping: 4 }),
        withSpring(1)
      );
    } else {
      // Shake for wrong answer
      scaleAnim.value = withSequence(
        withSpring(1.05),
        withSpring(0.95),
        withSpring(1)
      );
    }
  };

  const handleSelect = (item: SequencingItem) => {
    if (selected.find(s => s.id === item.id)) return;
    setSelected([...selected, item]);
  };

  const reset = () => {
    setSelected([]);
    setShowConfetti(false);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }]
  }));

  return (
    <View style={styles.container}>

      {/* Available items */}
      <FlatList
        data={sequence}
        numColumns={3}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: item.color, opacity: selected.find(s => s.id === item.id) ? 0.4 : 1 }]}
            onPress={() => handleSelect(item)}
            disabled={!!selected.find(s => s.id === item.id)}
          >
            <Text style={styles.cardText}>{item.label}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* Selected sequence */}
      <View style={styles.selectedRow}>
        {selected.map((item, idx) => (
          <Animated.View key={item.id} style={[styles.selectedCard, { backgroundColor: item.color }, animatedStyle]}>
            <Text style={styles.cardText}>{item.label}</Text>
          </Animated.View>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.buttons}>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#4CAF50' }]} onPress={checkAnswer}>
          <Text style={styles.buttonText}>Check</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#f44336' }]} onPress={reset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Confetti Celebration */}
      {showConfetti && (
        <ConfettiCannon
          count={60}
          origin={{ x: width / 2, y: 0 }}
          autoStart
          fadeOut
          onAnimationEnd={() => setShowConfetti(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFF6FF',
    padding: 16,
    justifyContent: 'flex-start',
  },
  grid: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: width / 3.5,
    height: width / 4,
    margin: 8,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  selectedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 60,
  },
  selectedCard: {
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    marginBottom: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});