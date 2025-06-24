import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  Linking,
} from 'react-native';
import { colors } from '@theme/colors';
import { captureError } from '@utils/errorReporting';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  lastErrorTime: number;
  isRecovering: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  private static readonly MAX_ERRORS_PER_MINUTE = 5;
  private static readonly ERROR_RESET_INTERVAL = 60000; // 1 minute
  private static readonly DEFAULT_RETRY_DELAY = 2000; // 2 seconds

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      retryCount: 0, 
      lastErrorTime: 0,
      isRecovering: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const now = Date.now();
    const { lastErrorTime } = this.state;

    // Rate limiting: prevent infinite error loops
    if (now - lastErrorTime < ErrorBoundary.ERROR_RESET_INTERVAL) {
      const errorCount = this.state.retryCount + 1;
      
      if (errorCount > ErrorBoundary.MAX_ERRORS_PER_MINUTE) {
        if (__DEV__) {
          console.error('Too many errors detected, preventing further error handling');
        }
        return;
      }
      
      this.setState({ retryCount: errorCount });
    } else {
      this.setState({ retryCount: 1, lastErrorTime: now });
    }

    // Log the error to console in development
    if (__DEV__) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Capture error for reporting with enhanced context
    captureError(error, errorInfo, {
      tags: {
        component: this.props.componentName || 'ErrorBoundary',
        location: 'app-level',
        retryCount: this.state.retryCount.toString(),
        timestamp: new Date().toISOString(),
      },
    });

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo);

    // Update state with error info
    this.setState({ error, errorInfo });
  }

  componentDidUpdate(prevProps: Props) {
    // Reset error state when props change (if enabled)
    if (this.props.resetOnPropsChange && prevProps !== this.props) {
      this.setState({ 
        hasError: false, 
        error: undefined, 
        errorInfo: undefined,
        retryCount: 0,
        isRecovering: false,
      });
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      retryCount: 0,
      isRecovering: false,
    });
  };

  handleRetry = () => {
    const { maxRetries = 3, retryDelay = ErrorBoundary.DEFAULT_RETRY_DELAY } = this.props;
    
    if (this.state.retryCount >= maxRetries) {
      Alert.alert(
        'Maximum Retries Reached',
        'Unable to recover from this error. Please restart the app.',
        [{ text: 'OK' }]
      );
      return;
    }

    this.setState({ isRecovering: true });

    setTimeout(() => {
      this.handleReset();
    }, retryDelay);
  };

  handleReportError = () => {
    if (this.state.error) {
      Alert.alert(
        'Error Report',
        `Would you like to report this error?\n\nError: ${this.state.error.message}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Report', 
            onPress: () => {
              // Here you would typically send the error to your error reporting service
              Alert.alert('Thank you!', 'Error report submitted.');
            }
          }
        ]
      );
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              <Text style={styles.emoji}>😔</Text>
              <Text style={styles.title}>Oops! Something went wrong</Text>
              <Text style={styles.message}>
                We're sorry, but something unexpected happened. Please try again.
              </Text>
              
              {this.state.isRecovering && (
                <View style={styles.recoveringContainer}>
                  <Text style={styles.recoveringText}>Recovering...</Text>
                </View>
              )}
              
              {__DEV__ && this.state.error && (
                <View style={styles.errorDetails}>
                  <Text style={styles.errorTitle}>Error Details (Development):</Text>
                  <Text style={styles.errorText}>{this.state.error.message}</Text>
                  {this.state.errorInfo?.componentStack && (
                    <Text style={styles.stackText}>
                      {this.state.errorInfo.componentStack}
                    </Text>
                  )}
                </View>
              )}

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.primaryButton} onPress={this.handleRetry}>
                  <Text style={styles.primaryButtonText}>
                    Try Again ({this.state.retryCount}/{this.props.maxRetries || 3})
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.secondaryButton} onPress={this.handleReset}>
                  <Text style={styles.secondaryButtonText}>Reset</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.tertiaryButton} onPress={this.handleReportError}>
                  <Text style={styles.tertiaryButtonText}>Report Error</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
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
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary[900],
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: colors.primary[700],
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  recoveringContainer: {
    backgroundColor: colors.success[50],
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  recoveringText: {
    fontSize: 16,
    color: colors.success[700],
    fontWeight: '600',
  },
  errorDetails: {
    backgroundColor: colors.error[50],
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.error[800],
    marginBottom: 5,
  },
  errorText: {
    fontSize: 12,
    color: colors.error[700],
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 10,
  },
  stackText: {
    fontSize: 10,
    color: colors.error[600],
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
  },
  primaryButton: {
    backgroundColor: colors.primary[600],
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: colors.background.secondary,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary[300],
  },
  secondaryButtonText: {
    color: colors.primary[700],
    fontSize: 14,
    fontWeight: '600',
  },
  tertiaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
  },
  tertiaryButtonText: {
    color: colors.text.secondary,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
}); 