import { useMutation, useQueryClient } from '@tanstack/react-query';
import weeklyReportApi from '../api/weekly-report-api';
import { WeeklyReportQueryKey } from '../query-keys';

const useCloseWeeklyReport = (weeklyReportId: string) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (params: {
      runEntries: {
        id: string;
        runDistance: number;
        goalDistance: number;
        userId: string;
        userName: string;
      }[];
      base64Image?: string;
    }) => {
      const success = await weeklyReportApi.requestCloseWeeklyReport(
        weeklyReportId,
        params
      );

      return success;
    },
    onSettled: () =>
      queryClient.invalidateQueries(WeeklyReportQueryKey(weeklyReportId)),
  });

  return mutate;
};

export default useCloseWeeklyReport;
