import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  Share,
  Linking,
} from 'react-native';
import { colors } from '@theme/colors';
import { captureError } from '@utils/errorReporting';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  enableRecovery?: boolean;
  showErrorDetails?: boolean;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorCount: number;
  lastErrorTime: number;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  private static readonly MAX_ERRORS_PER_MINUTE = 5;
  private static readonly ERROR_RESET_INTERVAL = 60000; // 1 minute

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      errorCount: 0,
      lastErrorTime: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const now = Date.now();
    const { errorCount, lastErrorTime } = this.state;

    // Rate limiting: prevent infinite error loops
    if (now - lastErrorTime < EnhancedErrorBoundary.ERROR_RESET_INTERVAL) {
      const newErrorCount = errorCount + 1;
      
      if (newErrorCount > EnhancedErrorBoundary.MAX_ERRORS_PER_MINUTE) {
        console.error('Too many errors detected, preventing further error handling');
        return;
      }
      
      this.setState({ errorCount: newErrorCount });
    } else {
      this.setState({ errorCount: 1, lastErrorTime: now });
    }

    // Log the error to console in development
    if (__DEV__) {
      console.error('EnhancedErrorBoundary caught an error:', error, errorInfo);
    }

    // Capture error for reporting with enhanced context
    captureError(error, errorInfo, {
      tags: {
        component: this.props.componentName || 'EnhancedErrorBoundary',
        location: 'app-level',
        errorCount: this.state.errorCount.toString(),
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
        errorCount: 0,
      });
    }
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      errorCount: 0,
    });
  };

  handleReportError = async () => {
    if (!this.state.error) return;

    try {
      const errorReport = this.generateErrorReport();
      
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        // Share error report
        await Share.share({
          message: errorReport,
          title: 'Error Report - Ilmcha App',
        });
      } else {
        // Copy to clipboard on web
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(errorReport);
          Alert.alert('Copied!', 'Error report copied to clipboard.');
        }
      }
    } catch (shareError) {
      console.error('Error sharing report:', shareError);
      Alert.alert('Error', 'Failed to share error report.');
    }
  };

  handleContactSupport = () => {
    const supportEmail = 'support@ilmcha.com';
    const subject = 'Ilmcha App Error Report';
    const body = this.generateErrorReport();
    
    const mailtoUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.canOpenURL(mailtoUrl).then(supported => {
      if (supported) {
        Linking.openURL(mailtoUrl);
      } else {
        Alert.alert(
          'Email Not Available',
          `Please email us at ${supportEmail} with the error details.`
        );
      }
    });
  };

  handleRestartApp = () => {
    Alert.alert(
      'Restart App',
      'This will restart the application. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Restart', 
          style: 'destructive',
          onPress: () => {
            // In a real app, you might want to use a restart mechanism
            // For now, we'll just reset the error state
            this.handleReset();
          }
        }
      ]
    );
  };

  generateErrorReport = (): string => {
    const { error, errorInfo, errorCount } = this.state;
    const timestamp = new Date().toISOString();
    
    return `
Ilmcha App Error Report
=======================

Timestamp: ${timestamp}
Error Count: ${errorCount}
Component: ${this.props.componentName || 'Unknown'}

Error Message: ${error?.message || 'Unknown error'}
Error Stack: ${error?.stack || 'No stack trace'}

Component Stack: ${errorInfo?.componentStack || 'No component stack'}

Device Info:
- Platform: ${Platform.OS}
- Version: ${Platform.Version}
- Model: ${Platform.OS === 'ios' ? Platform.constants.systemName : 'Android'}

Please include any steps that led to this error.
    `.trim();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Enhanced fallback UI
      return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.content}>
              <Text style={styles.emoji}>😔</Text>
              <Text style={styles.title}>Oops! Something went wrong</Text>
              <Text style={styles.message}>
                We're sorry, but something unexpected happened. Our team has been notified.
              </Text>
              
              {this.state.errorCount > 1 && (
                <View style={styles.warningContainer}>
                  <Text style={styles.warningText}>
                    ⚠️ Multiple errors detected. Please try restarting the app.
                  </Text>
                </View>
              )}
              
              {__DEV__ && this.state.error && this.props.showErrorDetails && (
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
                <TouchableOpacity style={styles.primaryButton} onPress={this.handleReset}>
                  <Text style={styles.primaryButtonText}>Try Again</Text>
                </TouchableOpacity>
                
                {this.props.enableRecovery && (
                  <TouchableOpacity style={styles.secondaryButton} onPress={this.handleRestartApp}>
                    <Text style={styles.secondaryButtonText}>Restart App</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.supportContainer}>
                <TouchableOpacity style={styles.supportButton} onPress={this.handleReportError}>
                  <Text style={styles.supportButtonText}>📋 Copy Error Report</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.supportButton} onPress={this.handleContactSupport}>
                  <Text style={styles.supportButtonText}>📧 Contact Support</Text>
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
  warningContainer: {
    backgroundColor: colors.warning[50],
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  warningText: {
    fontSize: 14,
    color: colors.warning[800],
    textAlign: 'center',
    fontWeight: '500',
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
  supportContainer: {
    width: '100%',
    gap: 10,
  },
  supportButton: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  supportButtonText: {
    color: colors.gray[700],
    fontSize: 14,
    fontWeight: '500',
  },
}); 