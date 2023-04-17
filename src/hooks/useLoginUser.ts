import authApi from '@api/auth-api';
import { useQuery } from '@tanstack/react-query';
import { LoginUserQueryKey } from 'src/query-keys';
import useAuthToken from './useAuthToken';

const useLoginUser = () => {
  const { authToken } = useAuthToken();

  return useQuery(
    LoginUserQueryKey(),
    async () => authApi.getLoginUser(authToken as string),
    { enabled: !!authToken }
  );
};
export default useLoginUser;
