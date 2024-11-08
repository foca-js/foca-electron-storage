import { ElectronStore } from './electron-store';
import type { StorageEngine } from 'foca';

const createElectronStorage = (
  opts: ElectronStore.Options<Record<string, string | undefined>>,
) => {
  const store = new ElectronStore(opts);

  return <StorageEngine>{
    getItem: (key) => {
      return new Promise((resolve) => {
        resolve(store.get(key) ?? null);
      });
    },
    setItem: (key, value) => {
      return new Promise((resolve) => {
        resolve(store.set(key, value));
      });
    },
    removeItem: (key) => {
      return new Promise((resolve) => {
        resolve(store.delete(key));
      });
    },
    clear: () => {
      return new Promise((resolve) => {
        resolve(store.clear());
      });
    },
  };
};

export const electronStorage = createElectronStorage({});
