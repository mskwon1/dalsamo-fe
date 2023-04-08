import { useQuery } from '@tanstack/react-query';
import ApiRequester from '../libs/api-requester';
import { WeeklyReportQueryKey } from '../query-keys';

const useWeeklyReport = (weeklyReportId: string) => {
  return useQuery(WeeklyReportQueryKey(weeklyReportId), async () => {
    const { data: weeklyReport } =
      await ApiRequester.get<ComposedWeeklyReportEntity>(
        `/weekly-reports/${weeklyReportId}`
      );

    return weeklyReport;
  });
};

export default useWeeklyReport;
