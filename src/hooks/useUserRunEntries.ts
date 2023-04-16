import { useQuery } from '@tanstack/react-query';
import { UserRunEntriesQueryKey } from 'src/query-keys';
import useAuthToken from './useAuthToken';
import weeklyReportApi from '@api/weekly-report-api';

const useUserRunEntries = () => {
  const { authToken } = useAuthToken();

  return useQuery(
    UserRunEntriesQueryKey(),
    async () => weeklyReportApi.requestUserRunEntries(authToken as string),
    { enabled: !!authToken }
  );
};
export default useUserRunEntries;
