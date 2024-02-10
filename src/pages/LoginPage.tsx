import { Spin, Typography, notification } from 'antd';
import dalsamoLogo from '../images/dalsamo.png';
import { GoogleLogin } from '@react-oauth/google';
import useLoginUser from '#hooks/useLoginUser';
import { useCallback, useEffect } from 'react';
import authApi from '#api/auth-api';
import useAuthToken from '#hooks/useAuthToken';
import { LoadingOutlined } from '@ant-design/icons';

const LoginPage = () => {
  const { setAuthToken } = useAuthToken();
  const { isFetching, isError } = useLoginUser();

  const onSuccess = useCallback(
    async (credentials: { credential?: string; clientId?: string }) => {
      const { credential } = credentials;

      try {
        const loginResult = await authApi.requestLogin(credential as string);

        if (!loginResult.success) {
          notification.error({ message: '로그인에 실패했습니다' });
          setAuthToken(null);

          return;
        }

        console.log(loginResult.user);
        setAuthToken(loginResult.token);
      } catch (e) {
        console.log(e);
        notification.error({
          message: '[Error Handler] 로그인에 실패했습니다',
        });
        setAuthToken(null);
      }
    },
    []
  );

  useEffect(() => {
    if (!isError) {
      return;
    }

    notification.error({ message: '로그인에 실패했습니다' });
    setAuthToken(null);
  }, [isError]);

  const onError = useCallback(() => {
    console.log('에러남 ㅈㅅ ㅋㅋ');
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <div style={{ marginBottom: 200, textAlign: 'center' }}>
        <img src={dalsamoLogo} width={200} />
        <Typography.Title level={3} style={{ marginTop: 4 }}>
          DALSAMO
        </Typography.Title>
        {isFetching ? (
          <Spin indicator={<LoadingOutlined />} />
        ) : (
          <GoogleLogin
            onSuccess={onSuccess}
            onError={onError}
            locale="kr"
            shape="pill"
          />
        )}
      </div>
    </div>
  );
};

export default LoginPage;
