import { useQuery } from '@tanstack/react-query';
import { UserRunEntriesQueryKey } from 'src/query-keys';
import useAuthToken from './useAuthToken';
import weeklyReportApi from '@api/weekly-report-api';

const useUserRunEntries = (params: { season?: string }) => {
  const { authToken } = useAuthToken();

  return useQuery(
    UserRunEntriesQueryKey(params),
    async () =>
      weeklyReportApi.requestUserRunEntries(params, authToken as string),
    { enabled: !!authToken }
  );
};
export default useUserRunEntries;
