import createAuthHeader from 'src/libs/create-auth-header';
import ApiRequester from '../libs/api-requester';

const requestOpenWeeklyReport = async (
  params: {
    startDate: string;
    runEntries: { userId: string; goalDistance: number }[];
  },
  token: string
) => {
  const {
    data: { createdId },
  } = await ApiRequester.post<{ createdId: string }>(
    '/weekly-reports/open',
    params,
    { headers: createAuthHeader(token) }
  );

  return createdId;
};

const requestCloseWeeklyReport = async (
  weeklyReportId: string,
  params: { runEntries: RunEntryEntity[]; base64Image?: string }
) => {
  const {
    data: { result },
  } = await ApiRequester.post<{ result: boolean }>(
    `/weekly-reports/${weeklyReportId}/close`,
    params
  );

  return result;
};

export default {
  requestOpenWeeklyReport,
  requestCloseWeeklyReport,
};
