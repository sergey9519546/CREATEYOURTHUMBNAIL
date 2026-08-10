export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      console.warn(`[safeStorage] Failed to get item '${key}':`, err);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.warn(`[safeStorage] Failed to set item '${key}':`, err);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      console.warn(`[safeStorage] Failed to remove item '${key}':`, err);
    }
  }
};
