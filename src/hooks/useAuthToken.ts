import { atom, useRecoilState } from 'recoil';
import localStorageEffect from 'src/recoil/localStorageEffect';

const KEY = 'AUTH_TOKEN';

const authTokenAtom = atom<string | null>({
  default: null,
  key: KEY,
  effects: [localStorageEffect(KEY)],
});

const useAuthToken = () => {
  const [authToken, setAuthToken] = useRecoilState(authTokenAtom);

  return {
    authToken,
    setAuthToken,
  };
};

export default useAuthToken;
