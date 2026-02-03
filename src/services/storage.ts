import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';

class StorageService {
  // Secure storage for sensitive data (tokens)
  async setSecure(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error saving to secure storage:', error);
      throw error;
    }
  }

  async getSecure(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error reading from secure storage:', error);
      return null;
    }
  }

  async removeSecure(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing from secure storage:', error);
    }
  }

  // Regular storage for non-sensitive data
  async set(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error saving to storage:', error);
      throw error;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
      // Also clear secure storage keys
      await this.removeSecure(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  // Auth-specific methods
  async saveAuthToken(token: string): Promise<void> {
    await this.setSecure(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  async getAuthToken(): Promise<string | null> {
    return this.getSecure(STORAGE_KEYS.AUTH_TOKEN);
  }

  async removeAuthToken(): Promise<void> {
    await this.removeSecure(STORAGE_KEYS.AUTH_TOKEN);
  }

  async saveUserData(user: any): Promise<void> {
    await this.set(STORAGE_KEYS.USER_DATA, user);
  }

  async getUserData(): Promise<any | null> {
    return this.get(STORAGE_KEYS.USER_DATA);
  }

  async removeUserData(): Promise<void> {
    await this.remove(STORAGE_KEYS.USER_DATA);
  }

  // Preferences
  async setOnboardingComplete(): Promise<void> {
    await this.set(STORAGE_KEYS.ONBOARDING_COMPLETE, true);
  }

  async isOnboardingComplete(): Promise<boolean> {
    const complete = await this.get<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETE);
    return complete === true;
  }
}

export const storage = new StorageService();
export default storage;
