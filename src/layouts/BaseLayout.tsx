import { Layout, Menu, theme } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import dalsamoLogo from '../images/dalsamo.png';
import { BarsOutlined, FileAddOutlined } from '@ant-design/icons';

const MENU_ITEMS = [
  {
    key: '1',
    icon: <BarsOutlined />,
    label: <Link to="/weekly-reports">주간기록 열람</Link>,
  },
  {
    key: '2',
    icon: <FileAddOutlined />,
    label: <Link to="/weekly-reports/new">주간기록 생성</Link>,
  },
];

const BaseLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout hasSider={true}>
      <Layout.Sider theme="light" breakpoint="sm" collapsedWidth={0}>
        <div
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <img src={dalsamoLogo} style={{ width: '100%', height: '100%' }} />
          </div>
          <Menu items={MENU_ITEMS} style={{ flexGrow: 1 }} />
        </div>
      </Layout.Sider>
      <Layout.Content>
        <div
          style={{
            height: '100vh',
            background: colorBgContainer,
            padding: 8,
          }}
        >
          <Outlet />
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default BaseLayout;
