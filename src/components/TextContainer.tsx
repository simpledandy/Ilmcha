import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';

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
    flexDirection: 'column',
  },
});

export default TextContainer; 