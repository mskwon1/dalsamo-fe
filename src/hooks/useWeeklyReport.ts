import { useQuery } from '@tanstack/react-query';
import ApiRequester from '../libs/api-requester';

const useWeeklyReport = (weeklyReportId: string) => {
  return useQuery(['weekly-reports', weeklyReportId], async () => {
    const { data: weeklyReport } =
      await ApiRequester.get<ComposedWeeklyReportEntity>(
        `/weekly-reports/${weeklyReportId}`
      );

    return weeklyReport;
  });
};

export default useWeeklyReport;
