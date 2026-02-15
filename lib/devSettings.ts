import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEVELOPER_NAME } from '../constants/dev';

const DEV_MODE_KEY = '@studysync_dev_mode';

// Check if a user is the developer
export function isDeveloper(displayName: string | null | undefined): boolean {
  return displayName === DEVELOPER_NAME;
}

// Get dev mode state
export async function getDevMode(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(DEV_MODE_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

// Set dev mode state
export async function setDevMode(enabled: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(DEV_MODE_KEY, enabled ? 'true' : 'false');
  } catch (error) {
    console.error('Failed to save dev mode:', error);
  }
}

// Toggle dev mode
export async function toggleDevMode(): Promise<boolean> {
  const current = await getDevMode();
  const newValue = !current;
  await setDevMode(newValue);
  return newValue;
}
