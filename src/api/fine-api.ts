import createAuthHeader from 'src/libs/create-auth-header';
import ApiRequester from '../libs/api-requester';

const requestCreateFine = async (
  params: {
    weeklyReportId?: string;
    userId: string;
    userName: string;
    value: number;
  },
  token: string
) => {
  const {
    data: { createdId },
  } = await ApiRequester.post<{ createdId: string }>('/fines', params, {
    headers: createAuthHeader(token),
  });

  return createdId;
};

const requestFineStatus = async () => {
  const {
    data: { status },
  } = await ApiRequester.get<{ status: FineStatus[] }>('/fines/status');

  return status;
};

export default { requestCreateFine, requestFineStatus };
