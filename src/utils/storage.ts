/**
 * A safe wrapper around localStorage to gracefully handle browser privacy restrictions,
 * QuotaExceeded errors, or disabled storage settings.
 */

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.warn(`Failed to read from localStorage for key "${key}":`, error);
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn(`Failed to write to localStorage for key "${key}":`, error);
    }
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Failed to remove from localStorage for key "${key}":`, error);
    }
  }
};
