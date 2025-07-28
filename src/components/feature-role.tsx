import React from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Select,
  FormInstance,
} from 'antd';
import { Permission } from '@/redux/slice/permission';

const { Title } = Typography;

interface Feature {
  key: string;
  label: string;
}

type PermissionState = Record<string, string[]>;

interface RoleFormProps {
  onSuccess: () => void;
  dataPermissions: Permission[];
  form: FormInstance;
  handleSubmitCreate: ({}: any) => void;
  handleEdit: ({}: any) => void;
  isLoading: boolean;
  isEdit: boolean;
}

const RoleForm: React.FC<RoleFormProps> = ({
  onSuccess,
  dataPermissions,
  handleSubmitCreate,
  handleEdit,
  isLoading,
  isEdit,
  form,
}) => {
  const handleSubmit = (values: any) => {
    const valueEntry = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v !== undefined),
    );
    if (!isEdit) handleSubmitCreate(valueEntry);
    else handleEdit(valueEntry);
  };

  return (
    <Card style={{ maxWidth: 800, margin: '0 auto' }}>
      <Title level={3}>Thêm vai trò</Title>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label="Tên vai trò"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên vai trò!' }]}>
          <Input placeholder="Nhập tên vai trò" />
        </Form.Item>
        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
          <Input placeholder="Nhập mô tả" />
        </Form.Item>

        <Form.Item
          label={`Quyền được phép`}
          name="permission_id"
          rules={[
            {
              required: true,
              message: `Vui lòng chọn các quyền được phép!`,
            },
          ]}>
          <Select
            allowClear
            showSearch
            mode="multiple"
            placeholder="Chọn quyền"
            filterOption={(input, option) =>
              (option?.label as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            options={(
              dataPermissions as {
                id: number;
                name: string;
                description: string;
              }[]
            ).map((r) => ({
              label: `${r.name} (${r.description})`,
              value: r.id,
            }))}
            style={{ width: '100%' }}
          />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center', marginTop: 40 }}>
          <Button htmlType="submit" type="primary">
            Xác nhận
          </Button>{' '}
          <Button
            htmlType="reset"
            onClick={() => {
              form.resetFields();
              onSuccess();
            }}>
            Hủy bỏ
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default RoleForm;
