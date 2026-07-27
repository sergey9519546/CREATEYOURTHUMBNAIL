/**
 * Safe wrapper for localStorage to handle incognito mode / quota limits gracefully
 */

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      console.warn(`Could not read ${key} from localStorage`, e);
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`Could not save ${key} to localStorage`, e);
    }
  },

  removeItem: (key: string): void => {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Could not remove ${key} from localStorage`, e);
    }
  }
};
