import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors } from '@theme/colors';

interface TextContainerProps extends ViewProps {
  spacing?: number;
}

export const TextContainer: React.FC<TextContainerProps> = ({
  children,
  style,
  spacing = 8,
  ...props
}) => {
  return (
    <View 
      style={[
        styles.container,
        { gap: spacing },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    shadowColor: colors.common.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 