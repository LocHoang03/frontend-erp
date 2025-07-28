import React from 'react';
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
import { Employee } from '@/redux/slice/employee';

const { Title } = Typography;

interface UserFormProps {
  onSuccess: () => void;
  form: FormInstance;
  handleSubmitCreate: ({}: any) => void;
  handleEdit: ({}: any) => void;
  dataRole: any[];
  dataEmployees: Employee[];
  isLoading: boolean;
  isEdit: boolean;
  mode: string;
  handleModeChange: (value: 'auto' | 'manual') => void;
}

const UserForm: React.FC<UserFormProps> = ({
  onSuccess,
  form,
  dataRole,
  handleSubmitCreate,
  isLoading,
  isEdit,
  mode,
  dataEmployees,
  handleModeChange,
  handleEdit,
}) => {
  const handleSubmit = (values: any) => {
    const valueEntry = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v !== undefined),
    );
    if (!isEdit) handleSubmitCreate(valueEntry);
    else handleEdit(valueEntry);
  };

  return (
    <Card style={{ maxWidth: 700, margin: '0 auto' }}>
      <Title level={3}>
        {isEdit ? 'Cập nhật người dùng' : 'Thêm người dùng'}
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
          label="Tên đăng nhập"
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}>
          <Input placeholder="Tên đăng nhập" />
        </Form.Item>

        <Form.Item
          label={`Được giao cho`}
          name="assigned_employee_id"
          rules={[
            {
              required: true,
              message: `Vui lòng chọn nhân sự!`,
            },
          ]}>
          <Select
            allowClear
            showSearch
            placeholder="Nhân sự sở hữu"
            filterOption={(input, option) =>
              (option?.label as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            options={(
              dataEmployees as {
                id: number;
                full_name: string;
                email: string;
              }[]
            ).map((r) => ({
              label: `${r.full_name} (${r.email})`,
              value: r.id,
            }))}
            style={{ width: '100%' }}
          />
        </Form.Item>

        {!isEdit && (
          <Row justify={'space-between'}>
            <Col span={mode === 'manual' ? 11 : 24}>
              <Form.Item
                label="Chế độ tạo mật khẩu"
                name="mode"
                initialValue="auto"
                rules={[{ required: true, message: 'Vui lòng chọn chế độ!' }]}>
                <Select onChange={handleModeChange}>
                  <Select.Option value="auto">Tự động tạo</Select.Option>
                  <Select.Option value="manual">Tạo thủ công</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            {mode === 'manual' && (
              <Col span={11}>
                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    { required: true, message: 'Vui lòng nhập mật khẩu!' },
                    { min: 6, message: 'Ít nhất 6 ký tự!' },
                  ]}>
                  <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
              </Col>
            )}
          </Row>
        )}

        <Form.Item
          label="Thiết lập vai trò"
          name="role_id"
          rules={[{ required: false, message: 'Vui lòng chọn vai trò!' }]}>
          <Select
            showSearch
            mode="multiple"
            placeholder="Chọn vai trò"
            options={dataRole.map((r) => ({
              label: r.name,
              value: r.id,
            }))}
            filterOption={(input, option) =>
              (option?.label as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center', marginTop: 30 }}>
          <Button
            htmlType="submit"
            type="primary"
            loading={isLoading}
            disabled={isLoading}>
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

export default UserForm;
