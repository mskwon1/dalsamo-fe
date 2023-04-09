import BaseLayout from './layouts/BaseLayout';
import useLoginUser from './hooks/useLoginUser';
import LoginPage from '@pages/LoginPage';

function Root() {
  const { data: loginUser } = useLoginUser();

  return loginUser ? <BaseLayout /> : <LoginPage />;
}

export default Root;
