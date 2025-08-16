import React, { useState } from 'react';
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { typography } from '@theme/typography';
import { inputVariants } from '@theme/input';
import { AppText } from './AppText';
import { colors } from '@theme/colors';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: any;
  variant?: keyof typeof inputVariants;
  size?: 'small' | 'default' | 'large';
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  style,
  containerStyle,
  placeholder,
  placeholderTextColor,
  variant = 'default',
  size = 'default',
  secureTextEntry,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const variantStyle = inputVariants[variant];
  const isPassword = !!secureTextEntry;
  return (
    <View style={[styles.inputContainer, Platform.OS === 'ios' ? styles.inputIOS : styles.inputAndroid]}>
      {label && (
        <AppText 
          variant="heading3" 
          style={[
            styles.label,
            error && { color: colors.error[500] }
          ]}
        >
          {label}
        </AppText>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={[
            variantStyle.input,
            size === 'large' && styles.inputLarge,
            size === 'small' && styles.inputSmall,
            {
              fontFamily: variantStyle.font,
              flex: 1,
            },
            error && { 
              borderColor: colors.input.error,
              borderWidth: 1,
            },
            style,
          ]}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor || colors.input.placeholder}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={{ padding: 4 }}>
            {/* Use a real icon if available, fallback to text */}
            {/* <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} color={colors.input.placeholder} /> */}
            <AppText style={{ color: colors.input.placeholder, fontSize: 18 }}>
              {showPassword ? '🙈' : '👁️'}
            </AppText>
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <AppText 
          variant="body" 
          style={[styles.error, { color: colors.error[500] }]}
        >
          {error}
        </AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  inputIOS: {
    // Add iOS specific styles here if needed
  },
  inputAndroid: {
    // Add Android specific styles here if needed
  },
  label: {
    marginBottom: 6,
  },
  inputLarge: {
    height: 56,
    fontSize: typography.fontSize.lg,
    paddingHorizontal: 16,
  },
  inputSmall: {
    height: 40,
    fontSize: typography.fontSize.sm,
    paddingHorizontal: 10,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  error: {
    color: '#EF4444',
    marginTop: 4,
  },
});

export default AppInput;