import { Layout, Menu, theme } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import dalsamoLogo from '../images/dalsamo.png';
import { BarsOutlined, FileAddOutlined } from '@ant-design/icons';
import { useMemo } from 'react';

const MENU_ROUTES = [
  {
    key: '1',
    icon: <BarsOutlined />,
    title: '주간기록 열람',
    pathname: '/weekly-reports',
  },
  {
    key: '2',
    icon: <FileAddOutlined />,
    title: '주간기록 생성',
    pathname: '/weekly-reports/new',
  },
];

const MENU_ITEMS = MENU_ROUTES.map(({ key, icon, title, pathname }) => {
  return {
    key,
    icon,
    label: <Link to={pathname}>{title}</Link>,
  };
});

const BaseLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { pathname } = useLocation();

  const selectedKeys = useMemo(() => {
    const matchedIndexes = [];

    for (const route of MENU_ROUTES) {
      if (pathname === route.pathname) {
        matchedIndexes.push(route.key);
      }
    }

    return matchedIndexes;
  }, [pathname]);

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
            <Link to="/">
              <img
                src={dalsamoLogo}
                style={{ width: '100%', height: '100%' }}
              />
            </Link>
          </div>
          <Menu
            items={MENU_ITEMS}
            style={{ flexGrow: 1 }}
            selectedKeys={selectedKeys}
          />
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
