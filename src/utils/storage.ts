export const safeStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("localStorage access restricted", e);
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("localStorage quota exceeded or access restricted", e);
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("localStorage access restricted", e);
    }
  }
};
