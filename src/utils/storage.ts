export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`[Storage Warning] Could not read ${key} from localStorage:`, error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`[Storage Warning] Could not write ${key} to localStorage (quota exceeded or disabled):`, error);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`[Storage Warning] Could not remove ${key} from localStorage:`, error);
    }
  }
};
