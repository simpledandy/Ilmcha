import React from 'react';
import { View, StyleSheet, Pressable, PressableProps } from 'react-native';
import { Text } from './Text';
import { colors } from '@theme/colors';

interface IslandProps extends PressableProps {
  title: string;
  subtitle?: string;
  size?: 'small' | 'medium' | 'large';
  status?: 'locked' | 'unlocked' | 'completed';
}

export const Island: React.FC<IslandProps> = ({
  title,
  subtitle,
  size = 'medium',
  status = 'locked',
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
      <Text 
        variant="heading3" 
        style={[
          styles.title,
          status === 'locked' && styles.lockedText
        ]}
      >
        {title}
      </Text>
      {subtitle && (
        <Text 
          variant="caption"
          style={[
            styles.subtitle,
            status === 'locked' && styles.lockedText
          ]}
        >
          {subtitle}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  island: {
    borderRadius: 20,
    padding: 20,
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