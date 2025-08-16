import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp, Text } from 'react-native';

interface BackButtonProps {
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  style?: StyleProp<ViewStyle>;
}

const sizeMap = {
  small: 24,
  medium: 32,
  large: 40,
};

export const BackButton: React.FC<BackButtonProps> = ({ onPress, size = 'medium', style }) => {
  const iconSize = sizeMap[size] || sizeMap.medium;
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]} accessibilityLabel="Back">
      <Text style={[styles.icon, { fontSize: iconSize }]}>←</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    color: '#333',
    fontWeight: 'bold',
  },
});

export default BackButton; 