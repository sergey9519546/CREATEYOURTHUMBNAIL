export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      console.warn(`Failed to read from localStorage for key: ${key}`, e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`Failed to write to localStorage for key: ${key}`, e);
    }
  },
  removeItem: (key: string): void => {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Failed to remove from localStorage for key: ${key}`, e);
    }
  },
};
