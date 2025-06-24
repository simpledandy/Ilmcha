import { ContextData } from '../types/common';

interface LogLevel {
  DEBUG: 0;
  INFO: 1;
  WARN: 2;
  ERROR: 3;
}

const LOG_LEVELS: LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

interface LogContext {
  component?: string;
  function?: string;
  userId?: string;
  sessionId?: string;
  [key: string]: ContextData[keyof ContextData];
}

class Logger {
  private static instance: Logger;
  private currentLevel: number;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = __DEV__;
    this.currentLevel = this.isDevelopment ? LOG_LEVELS.DEBUG : LOG_LEVELS.ERROR;
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setLogLevel(level: keyof LogLevel) {
    this.currentLevel = LOG_LEVELS[level];
  }

  private shouldLog(level: number): boolean {
    return level >= this.currentLevel;
  }

  private formatMessage(level: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${JSON.stringify(context)}]` : '';
    return `[${timestamp}] ${level}: ${message}${contextStr}`;
  }

  debug(message: string, context?: LogContext) {
    if (this.shouldLog(LOG_LEVELS.DEBUG)) {
      const formattedMessage = this.formatMessage('DEBUG', message, context);
      if (this.isDevelopment) {
        console.log(formattedMessage);
      }
    }
  }

  info(message: string, context?: LogContext) {
    if (this.shouldLog(LOG_LEVELS.INFO)) {
      const formattedMessage = this.formatMessage('INFO', message, context);
      if (this.isDevelopment) {
        console.info(formattedMessage);
      }
    }
  }

  warn(message: string, context?: LogContext) {
    if (this.shouldLog(LOG_LEVELS.WARN)) {
      const formattedMessage = this.formatMessage('WARN', message, context);
      if (this.isDevelopment) {
        console.warn(formattedMessage);
      }
    }
  }

  error(message: string, error?: Error, context?: LogContext) {
    if (this.shouldLog(LOG_LEVELS.ERROR)) {
      const formattedMessage = this.formatMessage('ERROR', message, context);
      if (this.isDevelopment) {
        console.error(formattedMessage, error);
      }
      // In production, you might want to send this to an error reporting service
    }
  }

  // Convenience methods for common use cases
  audio(message: string, audioKey?: string) {
    this.debug(message, { component: 'Audio', audioKey });
  }

  navigation(message: string, from?: string, to?: string) {
    this.info(message, { component: 'Navigation', from, to });
  }

  storage(message: string, operation?: string) {
    this.debug(message, { component: 'Storage', operation });
  }

  animation(message: string, component?: string) {
    this.debug(message, { component: 'Animation', target: component });
  }

  tracing(message: string, segment?: number) {
    this.debug(message, { component: 'Tracing', segment });
  }

  reward(message: string, activity?: string) {
    this.info(message, { component: 'Reward', activity });
  }
}

const logger = Logger.getInstance();

export { logger, Logger, LOG_LEVELS };
export type { LogContext }; 