import { useRouteError } from 'react-router-dom';
import { useEffect } from 'react';

const ErrorPage = () => {
  const error = useRouteError();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h1>에러가 발생해부렸네요</h1>
      <p>어쩔수없죠</p>
    </div>
  );
};

export default ErrorPage;
