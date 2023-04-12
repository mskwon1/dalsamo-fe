import { useRouteError } from 'react-router-dom';
import { useEffect } from 'react';
import { Result } from 'antd';

const ErrorPage = () => {
  const error = useRouteError();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Result
        status="500"
        title="뭔가 에러가 났네용 ㅋㅋ"
        subTitle="개발자한테 연락하면 고쳐줄지도? ㅎㅎ"
      />
    </div>
  );
};

export default ErrorPage;
