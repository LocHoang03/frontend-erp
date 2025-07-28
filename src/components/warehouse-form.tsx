import React from 'react';
import { Form, Input, Button, Card, Typography, FormInstance } from 'antd';

const { Title } = Typography;

interface FormProps {
  onSuccess: () => void;
  form: FormInstance;
  handleSubmitCreate: ({}: any) => void;
  handleSubmitUpdate: ({}: any) => void;
  isLoading: boolean;
  isEdit: boolean;
}

const WarehouseForm: React.FC<FormProps> = ({
  onSuccess,
  form,
  handleSubmitCreate,
  handleSubmitUpdate,
  isLoading,
  isEdit,
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
      <Title level={3}>{`${isEdit ? 'Cập nhật ' : 'Thêm '}`}</Title>
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        initialValues={{ is_active: true }}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label={`Tên kho`}
          name="name"
          rules={[
            {
              required: true,
              message: `Vui lòng nhập tên kho!`,
            },
          ]}>
          <Input placeholder="Nhập tên kho" />
        </Form.Item>

        <Form.Item
          label={`Địa chỉ kho`}
          name="location"
          rules={[
            {
              required: true,
              message: `Vui lòng nhập địa chỉ kho!`,
            },
          ]}>
          <Input placeholder="Nhập địa chỉ kho" />
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

export default WarehouseForm;
