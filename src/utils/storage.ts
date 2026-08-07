export const safeStorage = {
  getItem: (key: string) => {
    try { return localStorage.getItem(key); } catch (e) { console.error('localStorage.getItem error:', e); return null; }
  },
  setItem: (key: string, value: string) => {
    try { localStorage.setItem(key, value); } catch (e) { console.error('localStorage.setItem error:', e); }
  },
  removeItem: (key: string) => {
    try { localStorage.removeItem(key); } catch (e) { console.error('localStorage.removeItem error:', e); }
  }
};
