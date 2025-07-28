import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Select,
  FormInstance,
  Row,
  Col,
} from 'antd';

const { Title } = Typography;

interface FormProps {
  onSuccess: () => void;
  form: FormInstance;
  handleSubmitCreate: ({}: any) => void;
  handleSubmitUpdate: ({}: any) => void;
  isLoading: boolean;
  isEdit: boolean;
  type: string;
}

const DepartmentPositionForm: React.FC<FormProps> = ({
  onSuccess,
  form,
  handleSubmitCreate,
  handleSubmitUpdate,
  isLoading,
  isEdit,
  type,
}) => {
  const handleSubmit = (values: any) => {
    const valueEntry = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v !== undefined),
    );
    if (!isEdit) handleSubmitCreate(valueEntry);
    else handleSubmitUpdate(valueEntry);
  };

  return (
    <Card style={{ maxWidth: 700, margin: '0 auto' }}>
      <Title level={3}>
        {`${isEdit ? 'Cập nhật ' : 'Thêm '}` +
          `${type === 'postion' ? 'vị trí' : 'phòng ban'}`}
      </Title>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{ is_active: true }}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label={`Tên ${type === 'postion' ? 'vị trí' : 'phòng ban'}`}
          name="name"
          rules={[
            {
              required: true,
              message: `Vui lòng nhập ${
                type === 'postion' ? 'vị trí' : 'phòng ban'
              }!`,
            },
          ]}>
          <Input placeholder="Nhập tên" />
        </Form.Item>

        <Form.Item
          label={`Mã (code, vd: CNTT)`}
          name="code"
          rules={[
            {
              required: true,
              message: `Vui lòng nhập mã!`,
            },
          ]}>
          <Input placeholder="Nhập mã" />
        </Form.Item>

        <Form.Item
          label={`Mô tả`}
          name="description"
          rules={[
            {
              required: true,
              message: `Vui lòng nhập mô tả!`,
            },
          ]}>
          <Input placeholder="Nhập mô tả" />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center', marginTop: 30 }}>
          <Button htmlType="submit" type="primary" loading={isLoading}>
            Xác nhận
          </Button>{' '}
          <Button
            htmlType="reset"
            onClick={() => {
              onSuccess();
              form.resetFields();
            }}>
            Hủy bỏ
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default DepartmentPositionForm;
