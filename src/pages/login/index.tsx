import styles from '@/styles/auth/login/login.module.css';
import loginImage from '@/assets/image/login.jpg';
import Head from 'next/head';
import { Button, Form, Input, message } from 'antd';
import type { FormProps } from 'antd';
import { errors, success } from '@/components/success-error-info';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/userContext';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();
  type FieldType = {
    username?: string;
    password?: string;
  };

  const [hasMounted, setHasMounted] = useState(false);
  const [route, setRoute] = useState<string[]>([
    'dashboard',
    'manage-accounts',
    'permissions',
    'roles',
    'employees',
    'departments',
    'positions',
    'warehouses',
    'warehouses-transfers',
    'products',
    'category-products',
    'attendances',
    'salary',
    'projects',
    'tasks',
    'partners',
    'warehouse-transactions',
    'orders',
    'customers',
  ]);

  const { setUser } = React.useContext(UserContext);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const [messageApi, contextHolder] = message.useMessage();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/users/login`,
        values,
        { withCredentials: true },
      );
      if (res.data.success) {
        setUser(res.data.dataUser);
        success('Đăng nhập thành công', messageApi);
        setTimeout(() => {
          const redirectRoute = route.find((r) =>
            res.data.dataUser.userRole.some((perm: string) => perm.includes(r)),
          );

          if (redirectRoute) {
            router.push(
              `/${redirectRoute !== 'dashboard' ? redirectRoute : ''}`,
            );
          }
        }, 500);
      }
    } catch (error: any) {
      errors(error.response.data.message, messageApi);
      setIsLoading(false);
      return;
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo,
  ) => {
    console.log('Failed:', errorInfo);
  };

  if (!hasMounted) return null;
  return (
    <>
      {contextHolder}
      <Head>
        <title>Login</title>
        <meta name="description" content="Login with Daily Log" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preload" as="image" href={loginImage.src} />
      </Head>
      <main>
        <div
          className={`${styles.container}`}
          style={{
            backgroundImage: `url(${loginImage.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
          }}>
          <div className={`${styles.containerOpacity}`}></div>
          <div className={`${styles.formContainer}`}>
            <h2>CHÀO MỪNG TRỞ LẠI</h2>
            <h3>ĐĂNG NHẬP</h3>
            <Form
              name="basic"
              style={{ maxWidth: '100%', width: '100%' }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              form={form}
              onFinishFailed={onFinishFailed}
              autoComplete="off">
              <Form.Item<FieldType>
                name="username"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên tài khoản!' },
                ]}>
                <Input
                  className={styles.inputText}
                  placeholder="Tên tài khoản"
                />
              </Form.Item>

              <Form.Item<FieldType>
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                ]}>
                <Input.Password
                  className={styles.inputPassword}
                  placeholder="Mật khẩu"
                />
              </Form.Item>

              <Form.Item label={null}>
                <div className={`${styles.DivButtonLogin}`}>
                  <Button htmlType="submit" loading={isLoading}>
                    Đăng nhập
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </div>
      </main>
    </>
  );
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookie = ctx.req.headers.cookie || '';

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/users/whoami`,
    {
      headers: {
        Cookie: cookie,
      },
      withCredentials: true,
    },
  );
  if (res.data.isLogin) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return { props: {} };
};
