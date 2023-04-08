import ApiRequester from '../libs/api-requester';

const requestOpenWeeklyReport = async (params: {
  startDate: string;
  runEntries: { userId: string; goalDistance: number }[];
}) => {
  const {
    data: { createdId },
  } = await ApiRequester.post<{ createdId: string }>(
    '/weekly-reports/open',
    params
  );

  return createdId;
};

const requestCloseWeeklyReport = async (
  weeklyReportId: string,
  params: { runEntries: RunEntryEntity[] }
) => {
  const {
    data: { result },
  } = await ApiRequester.post<{ result: boolean }>(
    `/weekly-reports/${weeklyReportId}/close`,
    { runEntries: params.runEntries }
  );

  return result;
};

export default {
  requestOpenWeeklyReport,
  requestCloseWeeklyReport,
};
