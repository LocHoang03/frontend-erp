import React from 'react';
import { Form, Input, Button, Card, FormInstance } from 'antd';
import { DataPermission } from '@/pages/permissions';

interface PermissionFormProps {
  onSuccess: () => void;
  handleSubmitCreate: ({ name, description }: DataPermission) => void;
  handleEdit: ({ name, description }: DataPermission) => void;
  isEdit: boolean;
  form: FormInstance;
}

const PermissionForm: React.FC<PermissionFormProps> = ({
  onSuccess,
  handleSubmitCreate,
  handleEdit,
  isEdit,
  form,
}) => {
  const handleSubmit = () => {
    const name = form.getFieldValue('name');
    const description = form.getFieldValue('description');
    if (isEdit) {
      handleEdit({ name, description });
    } else {
      handleSubmitCreate({ name, description });
    }
    form.resetFields();
  };

  return (
    <Card style={{ maxWidth: 800, margin: '0 auto' }}>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          label="Tên quyền"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên quyền!' }]}>
          <Input placeholder="Nhập tên quyền" />
        </Form.Item>
        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
          <Input placeholder="Nhập mô tả" />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center', marginTop: 40 }}>
          <Button htmlType="submit" type="primary">
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

export default PermissionForm;
