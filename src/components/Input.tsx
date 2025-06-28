import React from "react";
import { TextInput, TextInputProps, StyleSheet, View } from "react-native";
import { textStyles } from "@theme/typography";
import { inputVariants } from "@theme/input";
import { Text } from "./Text";
import { colors } from "@theme/colors";
import { ContainerStyle } from "../types/common";

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ContainerStyle;
  variant?: keyof typeof inputVariants;
  size?: "small" | "default" | "large";
}

export const Input: React.FC<CustomInputProps> = ({
  label,
  error,
  style,
  containerStyle,
  placeholder,
  placeholderTextColor,
  variant = "default",
  size = "default",
  ...props
}) => {
  const variantStyle = inputVariants[variant];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          variant="label"
          style={[styles.label, error && { color: colors.error[500] }]}
        >
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          variantStyle.input,
          size === "large" && styles.inputLarge,
          size === "small" && styles.inputSmall,
          textStyles.input,
          error && {
            borderColor: colors.input.error,
            borderWidth: 1,
          },
          style,
        ]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor || colors.input.placeholder}
        {...props}
      />
      {error && (
        <Text
          variant="caption"
          style={[styles.error, { color: colors.error[500] }]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  error: {
    marginTop: 4,
    marginLeft: 4,
  },
  label: {
    marginBottom: 6,
  },
  inputLarge: {
    height: 56,
    paddingHorizontal: 16,
  },
  inputSmall: {
    height: 40,
    paddingHorizontal: 10,
  },
});
