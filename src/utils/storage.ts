/**
 * A safe wrapper around localStorage that catches and logs quota or access exceptions.
 * This prevents the application from crashing in private browsing modes or when storage is full.
 */
export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`[safeStorage] Failed to get item for key "${key}":`, e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`[safeStorage] Failed to set item for key "${key}" (Quota exceeded?):`, e);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[safeStorage] Failed to remove item for key "${key}":`, e);
    }
  }
};
