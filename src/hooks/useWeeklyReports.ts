import { useQuery } from '@tanstack/react-query';
import ApiRequester from '../libs/api-requester';

const useWeeklyReports = () => {
  return useQuery(['weekly-reports'], async () => {
    const {
      data: { weeklyReports },
    } = await ApiRequester.get<{ weeklyReports: WeeklyReportEntity[] }>(
      '/weekly-reports',
      { params: { limit: 50 } }
    );

    return weeklyReports;
  });
};

export default useWeeklyReports;
