import styles from '@/styles/auth/login/login.module.css';
import signupImage from '@/assets/image/signup.jpg';
import Head from 'next/head';
import Link from 'next/link';
import { Button, Form, Input } from 'antd';
import type { FormProps } from 'antd';

export default function Signup() {
  const [form] = Form.useForm();
  type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (
    errorInfo,
  ) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login with Daily Log" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preload" as="image" href={signupImage.src} />
      </Head>
      <main>
        <div
          className={`${styles.container}`}
          style={{
            backgroundImage: `url(${signupImage.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
          }}>
          <div className={`${styles.containerOpacity}`}></div>
          <div className={`${styles.formContainer}`}>
            <h2>ĐĂNG KÝ TÀI KHOẢN</h2>

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
                  <button>Đăng ký</button>
                </div>
              </Form.Item>
            </Form>
            <div className={`${styles.DivButtonSignup}`}>
              Đã có tài khoản?{' '}
              <Link href={'/login'} className={styles.link}>
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
