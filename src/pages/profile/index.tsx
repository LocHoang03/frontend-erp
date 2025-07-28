import React, { useState } from 'react';
import {
  Button,
  Input,
  Row,
  Col,
  Card,
  Upload,
  Divider,
  Form,
  message,
} from 'antd';
import { CameraOutlined, LoadingOutlined } from '@ant-design/icons';
import styles from '@/styles/profile/profile.module.css';
import Image from 'next/image';
import { UserContext } from '@/context/userContext';
import InputItem from '@/components/input-item';
import { errors, success } from '@/components/success-error-info';
import axios from 'axios';

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const { user, setUser } = React.useContext(UserContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const handleChangeAvatarUser = async (info: any) => {
    setLoading(true);
    if (
      info.file.type !== 'image/jpeg' &&
      info.file.type !== 'image/jpg' &&
      info.file.type !== 'image/png'
    ) {
      errors('Loại hình ảnh không hợp lệ!!', messageApi);
      setLoading(false);

      return;
    }

    try {
      const formData = new FormData();
      const file = (info as any)?.fileList[info.fileList.length - 1]
        ?.originFileObj;

      formData.append('avatar_url', file);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/employees/upload`,
        formData,
        {
          withCredentials: true,
        },
      );
      if (res.data) {
        setUser((prev: any) => {
          const dataUpdated = {
            ...prev,
            employee: {
              ...prev.employee,
              avatar_url: res.data.avatar_url,
              avatar_id: res.data.avatar_id,
            },
          };
          return dataUpdated;
        });
        success('Thay đổi ảnh đại diện thành công.', messageApi);
      }
    } catch (error: any) {
      errors(error.response.data.message, messageApi);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values: any) => {
    if (values.newPassword !== values.confirmNewPassword) {
      errors('Mật khẩu xác nhận không trùng khớp!!', messageApi);
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/users/change`,
        values,
        {
          withCredentials: true,
        },
      );
      form.resetFields();

      success('Thay đổi mật khẩu thành công.', messageApi);
    } catch (error: any) {
      errors(error.response.data.message, messageApi);
    }
  };
  const onFinishFailed = (errorInfo: any) => {};

  if (!user) {
    return (
      <div className="loadingGlobal">
        <p>Vui lòng chờ...</p>
        <LoadingOutlined />
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <div style={{ padding: 24 }} className={styles.divContainer}>
        <Row className={styles.divContainer} justify={'space-between'}>
          {user.role !== 'admin' && (
            <Col span={8}>
              <Card>
                <div className={styles.leftCard}>
                  <div>
                    <h3>Họ tên: {user.employee.full_name}</h3>
                  </div>
                  <Divider />

                  {loading ? (
                    <div className={styles.imageContainer}>
                      <LoadingOutlined style={{ fontSize: '30px' }} />
                    </div>
                  ) : (
                    <div className={styles.imageContainer}>
                      <Image
                        className={styles.image}
                        width={200}
                        height={200}
                        src={user.employee?.avatar_url}
                        alt={user.username}
                      />
                    </div>
                  )}
                  <div className={styles.upload}>
                    <Upload
                      showUploadList={false}
                      onChange={handleChangeAvatarUser}
                      beforeUpload={() => false}>
                      <Button icon={<CameraOutlined />}>Tải ảnh mới lên</Button>
                    </Upload>
                  </div>
                  <Divider />
                  <div className={styles.info}>
                    <p>Email: {user.employee.email}</p>
                    <p>Số điện thoại: {user.employee.phone_number}</p>
                    <p>Giới tính: {user.employee.gender}</p>
                    <p>Phòng ban: {user.employee.department.name}</p>
                    <p>Vị trí công việc: {user.employee.position.name}</p>
                    <p>Trạng thái: {user.employee.status}</p>
                  </div>
                </div>
              </Card>
            </Col>
          )}
          <Col span={user.role !== 'admin' ? 15 : 24}>
            <Card>
              <h3>Đổi mật khẩu</h3>
              <Divider />
              <Form
                name={'profileChangePasswordUser'}
                labelCol={{
                  span: 24,
                }}
                wrapperCol={{
                  span: 24,
                }}
                form={form}
                style={{
                  textAlign: 'center',
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                autoComplete="off">
                <InputItem
                  label="Mật khẩu hiện tại"
                  name="currentPassword"
                  message="Vui lòng nhập mật khẩu hiện tại!"
                  input={<Input.Password />}
                />
                <InputItem
                  label="Mật khẩu mới"
                  name="newPassword"
                  message="Vui lòng nhập mật khẩu mới!"
                  input={<Input.Password />}
                />
                <InputItem
                  label="Xác nhận mật khẩu mới"
                  name="confirmNewPassword"
                  message="Vui lòng nhập mật khẩu xác nhận!"
                  input={<Input.Password />}
                />
                <Form.Item
                  wrapperCol={{
                    span: 24,
                  }}>
                  <Button type="primary" htmlType="submit">
                    Cập nhật
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
