// Taken from https://dev.to/devlargs/nextjs-hook-for-accessing-local-or-session-storage-variables-3n0.

type StorageType = 'session' | 'local';
type UseStorageReturnValue = {
  getItem: (key: string, type?: StorageType) => string;
  setItem: (key: string, value: string, type?: StorageType) => boolean;
  removeItem: (key: string, type?: StorageType) => void;
  clear: (type?: StorageType) => void;
  clearAll: () => void;
};

const useStorage = (): UseStorageReturnValue => {
  const storageType = (type?: StorageType): 'localStorage' | 'sessionStorage' => `${type ?? 'session'}Storage`;

  const isBrowser: boolean = ((): boolean => typeof window !== 'undefined')();

  const getItem = (key: string, type?: StorageType): string => {
    return isBrowser ? window[storageType(type)][key] : undefined;
  };

  const setItem = (key: string, value: string, type?: StorageType): boolean => {
    if (isBrowser) {
      window[storageType(type)].setItem(key, value);
      return true;
    }

    return false;
  };

  const removeItem = (key: string, type?: StorageType): void => {
    window[storageType(type)].removeItem(key);
  };

  const clear = (type?: StorageType): void => {
    window[storageType(type)].clear();
  }

  const clearAll = (): void => {
    window[storageType('local')].clear();
    window[storageType('session')].clear();
  }

  return {
    getItem,
    setItem,
    removeItem,
    clear,
    clearAll,
  };
};

export default useStorage;