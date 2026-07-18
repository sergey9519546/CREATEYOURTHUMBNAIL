/**
 * Wrapper for localStorage to handle exceptions like QuotaExceededError or disabled storage.
 */
export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`safeStorage: Failed to read key "${key}" from localStorage`, e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`safeStorage: Failed to write key "${key}" to localStorage`, e);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`safeStorage: Failed to remove key "${key}" from localStorage`, e);
    }
  }
};
