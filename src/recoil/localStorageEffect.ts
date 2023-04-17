import { AtomEffect } from 'recoil';

const localStorageEffect =
  <T>(rawKey: string): AtomEffect<T> =>
  ({ setSelf, onSet }) => {
    const key = `DALSAMO_${rawKey}`;

    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue) as T);
    }

    onSet((newValue, _, isReset) => {
      isReset
        ? localStorage.removeItem(key)
        : localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export default localStorageEffect;
