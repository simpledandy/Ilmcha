import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { ToastAndroid } from 'react-native';
import { STORAGE_KEYS } from '../constants/storageKeys';

export interface StorageError {
  code: string;
  message: string;
  originalError?: Error;
}

export interface UserData {
  name?: string;
  email: string;
  needsOnboarding?: boolean;
  createdAt?: string;
  lastLoginAt?: string;
}

class StorageManager {
  private static instance: StorageManager;

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  private handleError(error: Error, operation: string): StorageError {
    return {
      code: "STORAGE_ERROR",
      message: `Failed to ${operation}`,
      originalError: error,
    };
  }

  private showToast(message: string) {
    if (Platform.OS === "android") {
      ToastAndroid.show(message, ToastAndroid.LONG);
    }
    // For iOS, you might want to use a different toast library or custom implementation
  }

  async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      const storageError = this.handleError(
        error instanceof Error ? error : new Error(String(error)),
        "save auth token",
      );
      this.showToast(storageError.message);
      throw new Error(storageError.message);
    }
  }

  async setUserData(user: UserData): Promise<void> {
    try {
      const userDataWithTimestamp = {
        ...user,
        updatedAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(userDataWithTimestamp),
      );
    } catch (error) {
      const storageError = this.handleError(
        error instanceof Error ? error : new Error(String(error)),
        "save user data",
      );
      this.showToast(storageError.message);
      throw new Error(storageError.message);
    }
  }

  async getUserData(): Promise<UserData | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (!data) return null;
      const parsedData: unknown = JSON.parse(data);
      if (
        typeof parsedData === "object" &&
        parsedData !== null &&
        "email" in parsedData
      ) {
        return parsedData as UserData;
      }
      return null;
    } catch {
      return null;
    }
  }

  async clearAuth(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
    } catch (error) {
      const storageError = this.handleError(
        error instanceof Error ? error : new Error(String(error)),
        "clear auth data",
      );
      this.showToast(storageError.message);
      throw new Error(storageError.message);
    }
  }
}

// Export singleton instance and utility functions
export const storageManager = StorageManager.getInstance();

export const storage = {
  setAuthToken: (token: string) => storageManager.setAuthToken(token),
  setUserData: (user: UserData) => storageManager.setUserData(user),
  getUserData: () => storageManager.getUserData(),
  clearAuth: () => storageManager.clearAuth(),
};