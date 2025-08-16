// Error reporting utility for production
// This can be integrated with services like Sentry, Firebase Crashlytics, or your own error tracking service

import { Platform } from 'react-native';
import type { ErrorInfo } from 'react';

interface ErrorReport {
  error: Error;
  errorInfo?: ErrorInfo;
  componentStack?: string;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  deviceInfo?: {
    platform: string;
    version: string;
    model?: string;
  };
  userAgent?: string;
}

class ErrorReporter {
  private static instance: ErrorReporter;
  private isInitialized = false;
  private queue: ErrorReport[] = [];

  static getInstance(): ErrorReporter {
    if (!ErrorReporter.instance) {
      ErrorReporter.instance = new ErrorReporter();
    }
    return ErrorReporter.instance;
  }

  initialize(config?: {
    enableReporting?: boolean;
    serviceUrl?: string;
    apiKey?: string;
  }) {
    if (this.isInitialized) return;

    this.isInitialized = true;
    
    // In production, you would initialize your error reporting service here
    // Example for Sentry:
    // if (config?.enableReporting) {
    //   Sentry.init({
    //     dsn: config.serviceUrl,
    //     environment: __DEV__ ? 'development' : 'production',
    //   });
    // }

    // Process any queued errors
    this.processQueue();
  }

  captureException(error: Error, errorInfo?: ErrorInfo, context?: {
    userId?: string;
    sessionId?: string;
    tags?: Record<string, string>;
  }) {
    const errorReport: ErrorReport = {
      error,
      errorInfo,
      componentStack: errorInfo?.componentStack || undefined,
      timestamp: Date.now(),
      userId: context?.userId,
      sessionId: context?.sessionId,
      deviceInfo: {
        platform: Platform.OS,
        version: Platform.Version.toString(),
        model: Platform.OS === 'ios' ? (Platform.constants as any)?.systemName : undefined,
      },
    };

    if (__DEV__) {
      // In development, log to console
      console.error('Error captured:', errorReport);
      return;
    }

    if (!this.isInitialized) {
      // Queue the error if reporter isn't initialized yet
      this.queue.push(errorReport);
      return;
    }

    // In production, send to error reporting service
    this.sendErrorReport(errorReport);
  }

  private sendErrorReport(errorReport: ErrorReport) {
    // In production, you would send this to your error reporting service
    // Example:
    // Sentry.captureException(errorReport.error, {
    //   extra: {
    //     errorInfo: errorReport.errorInfo,
    //     componentStack: errorReport.componentStack,
    //     userId: errorReport.userId,
    //     sessionId: errorReport.sessionId,
    //   },
    //   tags: {
    //     platform: errorReport.deviceInfo?.platform,
    //     version: errorReport.deviceInfo?.version,
    //   },
    // });

    // For now, just log to console in production
    console.error('Production error report:', errorReport);
  }

  private processQueue() {
    while (this.queue.length > 0) {
      const errorReport = this.queue.shift();
      if (errorReport) {
        this.sendErrorReport(errorReport);
      }
    }
  }

  setUser(userId: string, userInfo?: Record<string, any>) {
    // Set user context for error reports
    // Example for Sentry:
    // Sentry.setUser({
    //   id: userId,
    //   ...userInfo,
    // });
  }

  setTag(key: string, value: string) {
    // Set tags for error reports
    // Example for Sentry:
    // Sentry.setTag(key, value);
  }

  setContext(name: string, context: Record<string, any>) {
    // Set context for error reports
    // Example for Sentry:
    // Sentry.setContext(name, context);
  }
}

export const errorReporter = ErrorReporter.getInstance();

// Helper function to capture errors with proper typing
export const captureError = (
  error: Error, 
  errorInfo?: ErrorInfo, 
  context?: {
    userId?: string;
    sessionId?: string;
    tags?: Record<string, string>;
  }
) => {
  errorReporter.captureException(error, errorInfo, context);
};

// Initialize error reporting
export const initializeErrorReporting = (config?: {
  enableReporting?: boolean;
  serviceUrl?: string;
  apiKey?: string;
}) => {
  errorReporter.initialize(config);
}; 