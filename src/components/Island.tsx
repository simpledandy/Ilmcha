import React from 'react';
import { View, StyleSheet, Pressable, PressableProps } from 'react-native';
import { Text } from './Text';
import { colors } from '../theme/colors';
import { Image } from 'expo-image';
import i18n from '../../i18n';

interface IslandProps extends PressableProps {
  title: string;
  subtitle?: string;
  size?: 'small' | 'medium' | 'large';
  status?: 'locked' | 'unlocked' | 'completed';
  imageSource?: any; // Optional: Add image source prop if needed
}

export const Island: React.FC<IslandProps> = ({
  title,
  subtitle,
  size = 'medium',
  status = 'locked',
  imageSource = require('@assets/images/backgrounds/islands/numeriya.png'), // Default image
  ...props
}) => {
  const islandStyles = {
    small: styles.islandSmall,
    medium: styles.islandMedium,
    large: styles.islandLarge,
  };

  const statusStyles = {
    locked: {
      backgroundColor: colors.neutral[200],
      opacity: 0.7,
    },
    unlocked: {
      backgroundColor: colors.primary[100],
    },
    completed: {
      backgroundColor: colors.success[100],
    },
  };

  return (
    <Pressable
      style={[
        styles.island,
        islandStyles[size],
        statusStyles[status],
        props.disabled && styles.disabled,
      ]}
      {...props}
    >
      <Image
        source={imageSource} // Replace with your image path
        style={{ width: '100%', height: '100%'}}
        contentFit="contain"
      />
      <Text 
        variant="heading3" 
        style={[
          styles.title,
          status === 'locked' && styles.lockedText
        ]}
      >
        {i18n.t(title)}
      </Text>
      {subtitle && (
        <Text 
          variant="caption"
          style={[
            styles.subtitle,
            status === 'locked' && styles.lockedText
          ]}
        >
          {i18n.t(subtitle)}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  island: {
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  islandSmall: {
    width: 120,
    height: 120,
  },
  islandMedium: {
    width: 150,
    height: 150,
  },
  islandLarge: {
    width: 180,
    height: 180,
  },
  title: {
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    color: colors.text.secondary,
  },
  lockedText: {
    color: colors.text.disabled,
  },
  disabled: {
    opacity: 0.5,
  },
}); 