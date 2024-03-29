import createAuthHeader from 'src/libs/create-auth-header';
import ApiRequester from '../libs/api-requester';

const requestOpenWeeklyReport = async (
  params: {
    startDate: string;
    runEntries: { userId: string; goalDistance: number }[];
    season: string;
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
  params: {
    runEntries: {
      id: string;
      runDistance: number;
      goalDistance: number;
      userId: string;
      userName: string;
    }[];
    base64Image?: string;
  },
  token: string
) => {
  const {
    data: { result },
  } = await ApiRequester.post<{ result: boolean }>(
    `/weekly-reports/${weeklyReportId}/close`,
    params,
    { headers: createAuthHeader(token) }
  );

  return result;
};

const requestUpdateRunEntry = async (
  key: {
    weeklyReportId: string;
    runEntryId: string;
  },
  params: { runDistance: number; imageUrls?: string[] },
  token: string
) => {
  const { weeklyReportId, runEntryId } = key;

  const {
    data: { runEntry },
  } = await ApiRequester.put<{ runEntry: RunEntryEntity }>(
    `/run-entries/${runEntryId}`,
    { ...params, weeklyReportId },
    { headers: createAuthHeader(token) }
  );

  return runEntry;
};

const requestUserRunEntries = async (
  params: { season?: string },
  token: string
) => {
  const {
    data: { runEntries },
  } = await ApiRequester.get<{ runEntries: RunEntryEntity[] }>(
    '/run-entries/me',
    { headers: createAuthHeader(token), params }
  );

  return runEntries;
};

export default {
  requestOpenWeeklyReport,
  requestCloseWeeklyReport,
  requestUpdateRunEntry,
  requestUserRunEntries,
};
