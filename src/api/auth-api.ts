import ApiRequester from 'src/libs/api-requester';
import createAuthHeader from 'src/libs/create-auth-header';

const requestLogin = async (credential: string) => {
  const { data } = await ApiRequester.post<
    { success: false } | { user: UserEntity; token: string; success: true }
  >('auth/login', { credential });

  return data;
};

const getLoginUser = async (token: string) => {
  const {
    data: { user },
  } = await ApiRequester.get<{ user: UserEntity }>('users/me', {
    headers: { ...createAuthHeader(token) },
  });

  return user;
};

export default {
  requestLogin,
  getLoginUser,
};
