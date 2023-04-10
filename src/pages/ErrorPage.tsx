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
        status="404"
        title="못지나갑니다"
        subTitle="그런 페이지는 없답니다"
      />
    </div>
  );
};

export default ErrorPage;
