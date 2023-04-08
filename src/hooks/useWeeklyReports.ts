import { useQuery } from '@tanstack/react-query';
import ApiRequester from '../libs/api-requester';
import { WeeklyReportsQueryKey } from '../query-keys';

const useWeeklyReports = (params: { limit: number }) => {
  return useQuery(WeeklyReportsQueryKey(params), async () => {
    const {
      data: { weeklyReports },
    } = await ApiRequester.get<{ weeklyReports: WeeklyReportEntity[] }>(
      '/weekly-reports',
      { params }
    );

    return weeklyReports;
  });
};

export default useWeeklyReports;
