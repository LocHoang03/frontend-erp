import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import styles from '@/styles/layout.module.css';
import {
  ContainerOutlined,
  DashboardOutlined,
  DeliveredProcedureOutlined,
  DollarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProjectOutlined,
  RollbackOutlined,
  TeamOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Dropdown, Layout, Menu, Spin, theme } from 'antd';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/userContext';
import axios from 'axios';
import imageErp from '@/assets/image/erp.png';

const inter = Inter({ subsets: ['latin'] });
const { Header, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

// const items: MenuItem[] =
export default function LayoutApp({ children }: any) {
  const [collapsed, setCollapsed] = useState(false);
  const [path, setPath] = useState<string>();
  const [listSider, setListSider] = useState<string[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const { user } = React.useContext(UserContext);

  const itemsDropdown: MenuProps['items'] = [
    {
      key: '1',
      label: <span>Thông tin cá nhân</span>,
    },
    {
      key: '2',
      label: <span>Đăng xuất</span>,
    },
  ];

  useEffect(() => {
    const firstSegment = router.asPath.split('/')[1];
    setPath(firstSegment === '' ? '/' : firstSegment);
  }, [router]);

  useEffect(() => {
    if (user) {
      const result = [
        user.userRole?.some((item: string) => item.includes('dashboard')) &&
          'dashboard',
        user.userRole?.some((item: string) =>
          item.includes('manage-accounts'),
        ) && 'manage-accounts',
        user.userRole?.some((item: string) =>
          item.includes('permissions.read'),
        ) && 'permissions',
        user.userRole?.some((item: string) => item.includes('roles')) &&
          'roles',
        user.userRole?.some((item: string) => item.includes('employees')) &&
          'employees',
        user.userRole?.some((item: string) => item.includes('departments')) &&
          'departments',
        user.userRole?.some((item: string) => item.includes('positions')) &&
          'positions',
        user.userRole?.some((item: string) => item.includes('warehouses')) &&
          'warehouses',
        user.userRole?.some((item: string) =>
          item.includes('warehouses-transfers'),
        ) && 'warehouses-transfers',
        user.userRole?.some((item: string) => item.includes('products')) &&
          'products',
        user.userRole?.some((item: string) =>
          item.includes('category-products'),
        ) && 'category-products',
        user.userRole?.some((item: string) => item.includes('attendances')) &&
          'attendances',
        user.userRole?.some((item: string) => item.includes('salary')) &&
          'salary',
        user.userRole?.some((item: string) => item.includes('projects')) &&
          'projects',
        user.userRole?.some((item: string) => item.includes('tasks')) &&
          'tasks',
        user.userRole?.some((item: string) => item.includes('partners')) &&
          'partners',
        user.userRole?.some((item: string) =>
          item.includes('warehouse-transactions'),
        ) && 'warehouse-transactions',
        user.userRole?.some((item: string) => item.includes('orders')) &&
          'orders',
        user.userRole?.some((item: string) => item.includes('customers')) &&
          'customers',
        user.role === 'admin' && 'backups-and-restore',
        'profile',
      ].filter(Boolean);

      const menuItems = [
        user.userRole?.some((item: string) => item === 'dashboard.read') &&
          getItem('Thống kê', 'dashboard', <DashboardOutlined />),
        user.userRole?.some(
          (item: string) => item === 'manage-accounts.read',
        ) &&
          getItem('Danh sách tài khoản', 'manage-accounts', <UserOutlined />),
        (user.userRole?.some((item: string) => item === 'roles.read') ||
          user.userRole?.some((item: string) => item === 'permissions.read')) &&
          getItem('Vai trò & Quyền', 'roles-permissions', <TeamOutlined />, [
            user.userRole?.some((item: string) => item === 'roles.read') &&
              getItem('Vai trò', 'roles'),
            user.userRole?.some(
              (item: string) => item === 'permissions.read',
            ) && getItem('Quyền', 'permissions'),
          ]),

        (user.userRole?.some((item: string) => item === 'employees.read') ||
          user.userRole?.some((item: string) => item === 'departments.read') ||
          user.userRole?.some((item: string) => item === 'positions.read')) &&
          getItem(
            'Nhân sự & Phòng ban',
            'employees',
            <UsergroupAddOutlined />,
            [
              user.userRole?.some(
                (item: string) => item === 'employees.read',
              ) && getItem('Nhân sự', 'employees'),
              user.userRole?.some(
                (item: string) => item === 'departments.read',
              ) && getItem('Phòng ban', 'departments'),
              user.userRole?.some(
                (item: string) => item === 'positions.read',
              ) && getItem('Vị trí công việc', 'positions'),
            ],
          ),
        (user.userRole?.some((item: string) => item === 'warehouses.read') ||
          user.userRole?.some(
            (item: string) => item === 'warehouses-transfers.read',
          ) ||
          user.userRole?.some((item: string) => item === 'products.read') ||
          user.userRole?.some(
            (item: string) => item === 'category-products.read',
          )) &&
          getItem(
            'Kho & Sản phẩm',
            'warehouses',
            <DeliveredProcedureOutlined />,
            [
              user.userRole?.some(
                (item: string) => item === 'warehouses.read',
              ) && getItem('Kho', 'warehouses'),
              user.userRole?.some(
                (item: string) => item === 'warehouses-transfers.read',
              ) && getItem('Chuyển kho', 'warehouses-transfers'),
              user.userRole?.some((item: string) => item === 'products.read') &&
                getItem('Sản phẩm', 'products'),
              user.userRole?.some(
                (item: string) => item === 'category-products.read',
              ) && getItem('Danh mục sản phẩm', 'category-products'),
            ],
          ),
        (user.userRole?.some((item: string) => item === 'attendances.read') ||
          user.userRole?.some((item: string) => item === 'salary.read')) &&
          getItem('Chấm công & Lương', 'attendances', <DollarOutlined />, [
            user.userRole?.some(
              (item: string) => item === 'attendances.read',
            ) && getItem('Chấm công', 'attendances'),
            user.userRole?.some((item: string) => item === 'salary.read') &&
              getItem('Lương', 'salary'),
          ]),
        (user.userRole?.some((item: string) => item === 'projects.read') ||
          user.userRole?.some((item: string) => item === 'tasks.read')) &&
          getItem('Dự án & Công việc', 'projects', <ProjectOutlined />, [
            user.userRole?.some((item: string) => item === 'projects.read') &&
              getItem('Dự án', 'projects'),
            user.userRole?.some((item: string) => item === 'tasks.read') &&
              getItem('Công việc', 'tasks'),
          ]),

        (user.userRole?.some((item: string) => item === 'partner.read') ||
          user.userRole?.some(
            (item: string) => item === 'warehouse-transactions.read',
          )) &&
          getItem('Đối tác & Xuất/Nhập kho', 'partner', <ContainerOutlined />, [
            user.userRole?.some((item: string) => item === 'partners.read') &&
              getItem('Đối tác', 'partners'),
            user.userRole?.some(
              (item: string) => item === 'warehouse-transactions.read',
            ) && getItem('Xuất/Nhập kho', 'warehouse-transactions'),
          ]),
        (user.userRole?.some((item: string) => item === 'orders.read') ||
          user.userRole?.some((item: string) => item === 'customers.read')) &&
          getItem('Đơn hàng & Người dùng', 'orders', <ContainerOutlined />, [
            user.userRole?.some((item: string) => item === 'orders.read') &&
              getItem('Đơn hàng', 'orders'),
            user.userRole?.some((item: string) => item === 'customers.read') &&
              getItem('Người dùng', 'customers'),
          ]),
        user.role === 'admin' &&
          getItem(
            'Sao lưu & phục hồi',
            'backups-and-restore',
            <RollbackOutlined />,
          ),
      ].filter(Boolean);
      setListSider(result);
      setItems(menuItems);
    }
    setTimeout(() => {
      setHasMounted(true);
    }, 500);
  }, [user]);

  const handleChangeValueSider = (value: string) => {
    if (listSider.includes(value)) {
      router.push(`/${value != 'dashboard' ? value : ''}`);
    } else {
      router.push('404');
    }
  };

  if (!hasMounted || !user || !path)
    return (
      <div className={styles.loadingGlobal}>
        <p>Vui lòng chờ...</p>
        <Spin size="large" />
      </div>
    );

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <Layout style={{ minHeight: '100vh' }} hasSider>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            className={styles.siderContainer}
            style={{
              overflowY: 'auto',
              height: '100vh',
              position: 'fixed',
              left: 0,
              top: 0,
              bottom: 0,
            }}
            width={260}>
            <Menu
              className={'custom-menu'}
              mode="inline"
              defaultSelectedKeys={[path]}
              items={items}
              onSelect={({ key }) => handleChangeValueSider(key)}
            />
          </Sider>
          <Layout
            style={{
              flex: 1,
              minWidth: 0,
              marginLeft: collapsed ? 80 : 260,
              transition: 'all 0.2s, background 0s',
            }}>
            <Header
              className={styles.headerRight}
              style={{
                background: '#2b2e3e',
              }}>
              <div className={styles.searchContainer}>
                <Button
                  type="text"
                  icon={
                    collapsed ? (
                      <MenuUnfoldOutlined style={{ color: 'white' }} />
                    ) : (
                      <MenuFoldOutlined style={{ color: 'white' }} />
                    )
                  }
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                  }}
                />
                {/* <Space.Compact
                  style={{ width: '100%' }}
                  className={styles.search}>
                  <Input placeholder="Tìm kiếm" />
                  <Button>
                    <SearchOutlined />
                  </Button>
                </Space.Compact> */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Image
                    alt="image logo"
                    src={imageErp}
                    height={40}
                    width={40}
                  />
                  <h3 style={{ color: 'white', marginLeft: 10 }}>
                    Trình quản lý doanh nghiệp (mini)
                  </h3>
                </div>
              </div>

              <Dropdown
                menu={{
                  items: itemsDropdown,
                  onClick: async ({ key }) => {
                    if (key === '2') {
                      await axios.post(
                        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/users/logout`,
                        {},
                        { withCredentials: true },
                      );
                      router.push('/login');
                    } else {
                      router.push('/profile');
                    }
                  },
                }}>
                <div className={styles.profile}>
                  <h4 style={{ color: 'white' }}>{user.username}</h4>
                  <Image
                    src={
                      user.role !== 'admin'
                        ? user.employee.avatar_url
                        : process.env.NEXT_PUBLIC_IMAGE_EMPLOYEE
                    }
                    alt="image-user"
                    width={40}
                    height={40}
                    style={{ borderRadius: '50%', marginLeft: 10 }}
                  />
                </div>
              </Dropdown>
            </Header>
            <Content
              style={{
                margin: '24px 16px',
                padding: 24,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}>
              {children}
            </Content>
          </Layout>
        </Layout>
      </div>
    </>
  );
}
