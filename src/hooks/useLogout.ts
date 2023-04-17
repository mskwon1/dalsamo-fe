import { useQueryClient } from '@tanstack/react-query';
import useAuthToken from './useAuthToken';
import { useCallback } from 'react';

const useLogout = () => {
  const { setAuthToken } = useAuthToken();
  const queryClient = useQueryClient();

  return useCallback(() => {
    setAuthToken(null);
    queryClient.clear();
  }, [setAuthToken, queryClient]);
};

export default useLogout;
