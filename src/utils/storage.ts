import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_TOKEN: '@auth_token',
  USER_DATA: '@user_data',
} as const;

export const storage = {
  async setAuthToken(token: string) {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  async getAuthToken() {
    return AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  async setUserData(user: any) {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  },

  async getUserData() {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },

  async clearAuth() {
    await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.USER_DATA]);
  },
}; 