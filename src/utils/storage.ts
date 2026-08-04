export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`[safeStorage] Failed to get item '${key}':`, error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`[safeStorage] Failed to set item '${key}' (possible quota exceeded):`, error);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`[safeStorage] Failed to remove item '${key}':`, error);
    }
  }
};