import { Grid, Button, Col, Layout, Menu, Row, theme } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import dalsamoLogo from '../images/dalsamo.png';
import {
  BarsOutlined,
  FileAddOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useMemo, useState } from 'react';
import useLoginUser from '@hooks/useLoginUser';
import _ from 'lodash';
import useLogout from '@hooks/useLogout';

const MENU_ROUTES = [
  {
    key: '1',
    icon: <BarsOutlined />,
    title: '주간기록 열람',
    pathname: '/weekly-reports',
    roles: ['member', 'admin'],
  },
  {
    key: '2',
    icon: <FileAddOutlined />,
    title: '주간기록 생성',
    pathname: '/weekly-reports/new',
    roles: ['admin'],
  },
];

const MENU_ITEMS = MENU_ROUTES.map(({ key, icon, title, pathname, roles }) => {
  return {
    key,
    icon,
    label: <Link to={pathname}>{title}</Link>,
    roles,
  };
});

const BaseLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const { pathname } = useLocation();
  const { data: loginUser } = useLoginUser();
  const logout = useLogout();

  const selectedKeys = useMemo(() => {
    const matchedIndexes = [];

    for (const route of MENU_ROUTES) {
      if (pathname === route.pathname) {
        matchedIndexes.push(route.key);
      }
    }

    return matchedIndexes;
  }, [pathname]);

  const filteredMenuItems = useMemo(() => {
    if (!loginUser) {
      return MENU_ITEMS;
    }

    return _.filter(MENU_ITEMS, ({ roles }) => {
      return !_.isEmpty(_.intersection(roles, loginUser.roles));
    });
  }, [loginUser]);

  const [collapse, setCollapse] = useState();
  const { md } = Grid.useBreakpoint();

  console.log({ md });

  return (
    <Layout hasSider={true}>
      <Layout.Sider
        theme="light"
        breakpoint="sm"
        trigger={null}
        collapsedWidth={0}
        collapsed={collapse}
        onCollapse={setCollapse}
      >
        <div
          style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <Link to="/">
            <img src={dalsamoLogo} style={{ width: '100%', height: '100%' }} />
          </Link>
          <Menu
            items={filteredMenuItems}
            style={{ flexGrow: 1 }}
            selectedKeys={selectedKeys}
            onClick={md ? undefined : () => setCollapse(true)}
          />
        </div>
      </Layout.Sider>
      <Layout>
        <Layout.Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            background: colorBgContainer,
            height: 30,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingLeft: 8,
            paddingRight: 8,
            boxShadow: '0 2px 2px 0 lightgray',
          }}
        >
          {collapse ? (
            <MenuUnfoldOutlined onClick={() => setCollapse(false)} />
          ) : (
            <MenuFoldOutlined onClick={() => setCollapse(true)} />
          )}
          <Button
            size="small"
            type="text"
            style={{ fontSize: 12 }}
            onClick={logout}
          >
            로그아웃
          </Button>
        </Layout.Header>
        <Layout.Content style={{ background: colorBgContainer }}>
          <Row>
            <Col
              xs={24}
              lg={20}
              xl={18}
              xxl={16}
              style={{
                height: '100vh',
                background: colorBgContainer,
                padding: 8,
              }}
            >
              <Outlet />
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default BaseLayout;
