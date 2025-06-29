// Error reporting utility for production
// This can be integrated with services like Sentry, Firebase Crashlytics, or your own error tracking service

import { Platform } from "react-native";
import { ContextData, ErrorInfo } from "../types/common";

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

  initialize() {
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

  captureException(
    error: Error,
    errorInfo?: ErrorInfo,
    context?: {
      userId?: string;
      sessionId?: string;
      tags?: Record<string, string>;
    },
  ) {
    const errorReport: ErrorReport = {
      error,
      errorInfo,
      componentStack: errorInfo?.componentStack,
      timestamp: Date.now(),
      userId: context?.userId,
      sessionId: context?.sessionId,
      deviceInfo: {
        platform: Platform.OS,
        version: Platform.Version?.toString() || "unknown",
        model:
          Platform.OS === "ios" ? Platform.constants.systemName : undefined,
      },
    };

    if (__DEV__) {
      // In development, log to console
      console.error("Error captured:", errorReport);
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
    console.error("Production error report:", errorReport);
  }

  private processQueue() {
    while (this.queue.length > 0) {
      const errorReport = this.queue.shift();
      if (errorReport) {
        this.sendErrorReport(errorReport);
      }
    }
  }

  setUser(_userId: string, _userInfo?: ContextData) {
    // Set user context for error reports
    // Example for Sentry:
    // Sentry.setUser({
    //   id: userId,
    //   ...userInfo,
    // });
  }

  setTag(_key: string, _value: string) {
    // Set tags for error reports
    // Example for Sentry:
    // Sentry.setTag(key, value);
  }

  setContext(_name: string, _context: ContextData) {
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
  },
) => {
  errorReporter.captureException(error, errorInfo, context);
};

// Initialize error reporting
export const initializeErrorReporting = () => {
  errorReporter.initialize();
};
