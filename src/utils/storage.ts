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
      const storageError = this.handleError(
        error instanceof Error ? error : new Error(String(error)),
        "load user data",
      );
      this.showToast(storageError.message);
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

  // Station progress methods
  async setStationProgress(progress: Record<string, unknown>): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.STATION_PROGRESS,
        JSON.stringify(progress),
      );
    } catch (error) {
      const storageError = this.handleError(
        error instanceof Error ? error : new Error(String(error)),
        "save station progress",
      );
      this.showToast(storageError.message);
      throw new Error(storageError.message);
    }
  }

  async getStationProgress(): Promise<Record<string, unknown> | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.STATION_PROGRESS);
      if (!data) return null;
      return JSON.parse(data) as Record<string, unknown>;
    } catch (error) {
      const storageError = this.handleError(
        error instanceof Error ? error : new Error(String(error)),
        "load station progress",
      );
      this.showToast(storageError.message);
      return null;
    }
  }

  async setIslandProgress(progress: Record<string, unknown>): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.ISLAND_PROGRESS,
        JSON.stringify(progress),
      );
    } catch (error) {
      const storageError = this.handleError(
        error instanceof Error ? error : new Error(String(error)),
        "save island progress",
      );
      this.showToast(storageError.message);
      throw new Error(storageError.message);
    }
  }

  async getIslandProgress(): Promise<Record<string, unknown> | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ISLAND_PROGRESS);
      if (!data) return null;
      return JSON.parse(data) as Record<string, unknown>;
    } catch (error) {
      const storageError = this.handleError(
        error instanceof Error ? error : new Error(String(error)),
        "load island progress",
      );
      this.showToast(storageError.message);
      return null;
    }
  }
}

const storageManager = StorageManager.getInstance();

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
  setStationProgress: (progress: Record<string, unknown>) =>
    storageManager.setStationProgress(progress),
  getStationProgress: () => storageManager.getStationProgress(),
  setIslandProgress: (progress: Record<string, unknown>) =>
    storageManager.setIslandProgress(progress),
  getIslandProgress: () => storageManager.getIslandProgress(),
};
