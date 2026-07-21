export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`Failed to read from localStorage: ${e}`);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`Failed to write to localStorage: ${e}`);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Failed to remove from localStorage: ${e}`);
    }
  },
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn(`Failed to clear localStorage: ${e}`);
    }
  }
};
