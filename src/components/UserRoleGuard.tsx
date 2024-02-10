import { LoadingOutlined } from '@ant-design/icons';
import useLoginUser from '#hooks/useLoginUser';
import { Result, Spin, Typography } from 'antd';
import { intersection, isEmpty } from 'lodash';
import { PropsWithChildren } from 'react';
import dalsamoLogo from '#images/dalsamo.png';

const UserRoleGuard = ({
  children,
  allowedRoles,
}: PropsWithChildren<{ allowedRoles: string[] }>) => {
  const { data: user, isLoading } = useLoginUser();

  if (isLoading || !user) {
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
          <Spin indicator={<LoadingOutlined />} />
        </div>
      </div>
    );
  }

  const { roles } = user;

  if (isEmpty(intersection(roles, allowedRoles))) {
    return (
      <Result
        status="403"
        title="못지나갑니다"
        subTitle="접근권한이 없습니다. 부탁하면 개발자가 줄수도?"
      />
    );
  }

  return <>{children}</>;
};

export default UserRoleGuard;
