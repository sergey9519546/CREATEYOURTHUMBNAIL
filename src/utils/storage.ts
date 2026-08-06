/**
 * Safe localStorage wrapper that degrades gracefully if storage access is blocked
 * (e.g. strict privacy modes) or quota is exceeded.
 */
export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (error) {
      console.warn(`[safeStorage] Failed to read ${key}:`, error);
    }
    return null;
  },

  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn(`[safeStorage] Failed to save ${key}:`, error);
    }
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`[safeStorage] Failed to remove ${key}:`, error);
    }
  }
};
