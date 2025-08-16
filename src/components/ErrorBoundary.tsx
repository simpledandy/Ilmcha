import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { AppText } from './AppText';
import { typography } from '../theme/typography';

// Minimal props and state
interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}
interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (__DEV__) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    this.setState({ error });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <View style={styles.container}>
          <AppText style={styles.emoji}>😔</AppText>
          <AppText style={styles.title}>Oops! Something went wrong.</AppText>
          <AppText style={styles.message}>An unexpected error occurred.</AppText>
          <TouchableOpacity style={styles.primaryButton} onPress={this.handleReset}>
            <Text style={styles.primaryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emoji: {
    fontSize: typography.fontSize['3xl'],
    marginBottom: 20,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: 'bold',
    color: colors.primary[900],
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: typography.fontSize.base,
    color: colors.primary[700],
    textAlign: 'center',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary[600],
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: typography.fontSize.base,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});