import styles from '@/styles/auth/login/login.module.css';
import loginImage from '@/assets/image/login.jpg';
import Head from 'next/head';
import Link from 'next/link';
import { Button, Form, Input } from 'antd';
import type { FormProps } from 'antd';

export default function Login() {
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
            <h2>ĐĂNG NHẬP</h2>
            {/* <form className={`${styles.form}`}>
              <div>
                <input type="text" placeholder="Nhập tên tài khoản" />
              </div>
              <div>
                <input type="password" placeholder="Nhập mật khẩu" />
              </div>
              <div className={`${styles.DivButtonLogin}`}>
                <button>Đăng nhập</button>
              </div>
            </form> */}
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
                  <button>Đăng nhập</button>
                </div>
              </Form.Item>
            </Form>
            <div className={`${styles.DivButtonSignup}`}>
              Bạn là thành viên mới?{' '}
              <Link href={'/signup'} className={styles.link}>
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
