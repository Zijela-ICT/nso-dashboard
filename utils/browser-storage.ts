/* eslint-disable @typescript-eslint/no-explicit-any */
type StorageType = 'local' | 'session';

const storageUtil = {
  store: (key: string, value: string | any, type: StorageType = 'local') => {
    const storage =
      type === 'local' ? window.localStorage : window.sessionStorage;
    storage.setItem(key, value);
    window.dispatchEvent(new Event('storage'));
  },
  get: (key: string, type: StorageType = 'local'): string | null => {
    const storage =
      type === 'local' ? window.localStorage : window.sessionStorage;
    window.dispatchEvent(new Event('storage'));
    return storage.getItem(key);
  },
  delete: (key: string, type: StorageType = 'local') => {
    const storage =
      type === 'local' ? window.localStorage : window.sessionStorage;
    storage.removeItem(key);
  },
  clear: (type: StorageType = 'local') => {
    const storage =
      type === 'local' ? window.localStorage : window.sessionStorage;
    storage.clear();
  },
};

export default storageUtil;
