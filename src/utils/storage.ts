import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { Platform } from "react-native";
import { ToastAndroid } from "react-native";

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
    const storageError: StorageError = {
      code: "STORAGE_ERROR",
      message: `Failed to ${operation}`,
      originalError: error,
    };

    if (__DEV__) {
      console.error(`Storage ${operation} error:`, error);
    }

    return storageError;
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

  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      const storageError = this.handleError(
        error instanceof Error ? error : new Error(String(error)),
        "load auth token",
      );
      this.showToast(storageError.message);
      return null;
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
    } catch (error) {
      console.error("Error getting user data:", error);
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

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      const storageError = this.handleError(
        error instanceof Error ? error : new Error(String(error)),
        "clear all data",
      );
      this.showToast(storageError.message);
      throw new Error(storageError.message);
    }
  }

  async getStorageSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += new Blob([value]).size;
        }
      }

      return totalSize;
    } catch (error) {
      if (__DEV__) {
        console.error("Error calculating storage size:", error);
      }
      return 0;
    }
  }

  async migrateData(_fromVersion: string, _toVersion: string): Promise<void> {
    try {
      // Implement data migration logic here

      // Example migration: update user data structure
      const userData = await this.getUserData();
      if (userData && !userData.createdAt) {
        const updatedUserData: UserData = {
          ...userData,
          createdAt: new Date().toISOString(),
        };
        await this.setUserData(updatedUserData);
      }
    } catch (error) {
      const storageError = this.handleError(
        error instanceof Error ? error : new Error(String(error)),
        "migrate data",
      );
      throw new Error(storageError.message);
    }
  }
}

// Export singleton instance and utility functions
export const storageManager = StorageManager.getInstance();

export const storage = {
  setAuthToken: (token: string) => storageManager.setAuthToken(token),
  getAuthToken: () => storageManager.getAuthToken(),
  setUserData: (user: UserData) => storageManager.setUserData(user),
  getUserData: () => storageManager.getUserData(),
  clearAuth: () => storageManager.clearAuth(),
  clearAllData: () => storageManager.clearAllData(),
  getStorageSize: () => storageManager.getStorageSize(),
  migrateData: (fromVersion: string, toVersion: string) =>
    storageManager.migrateData(fromVersion, toVersion),
};

// User data management
export const saveUserData = async (userData: UserData): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify(userData),
    );
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error;
  }
};

export const getUserData = async (): Promise<UserData | null> => {
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
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

export const clearUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.AUTH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
  } catch (error) {
    console.error("Error clearing user data:", error);
    throw error;
  }
};
