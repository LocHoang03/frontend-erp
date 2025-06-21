import React, { useState } from 'react';
import {
  Form,
  Input,
  Checkbox,
  Row,
  Col,
  Button,
  Card,
  Typography,
  Divider,
} from 'antd';

const { Title } = Typography;

interface Feature {
  key: string;
  label: string;
}

const features: Feature[] = [
  { key: 'user', label: 'Quản lý người dùng' },
  { key: 'content', label: 'Quản lý nội dung' },
  { key: 'disputes', label: 'Xử lý tranh chấp' },
  { key: 'database', label: 'Quản lý cơ sở dữ liệu' },
  { key: 'finance', label: 'Quản lý tài chính' },
  { key: 'report', label: 'Báo cáo' },
  { key: 'api', label: 'Kiểm soát API' },
  { key: 'repository', label: 'Quản lý kho mã' },
  { key: 'payroll', label: 'Quản lý lương' },
];

const actions = ['Đọc', 'Viết', 'Tạo'];

type PermissionState = Record<string, string[]>;

interface RoleFormProps {
  onSuccess: () => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [permissions, setPermissions] = useState<PermissionState>({});

  const handleChange = (featureKey: string, checkedValues: string[]) => {
    setPermissions((prev) => ({
      ...prev,
      [featureKey]: checkedValues,
    }));
  };

  const handleSelectAll = () => {
    const all: PermissionState = {};
    features.forEach((f) => (all[f.key] = actions));
    setPermissions(all);
  };

  const handleSubmit = () => {
    const roleName = form.getFieldValue('roleName');
    console.log('📤 Submitted:', { roleName, permissions });
    // TODO: Gửi API tạo role ở đây
    onSuccess(); // ✅ Gọi callback sau khi thành công
  };

  return (
    <Card style={{ maxWidth: 800, margin: '0 auto' }}>
      <Title level={3}>Thêm vai trò</Title>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          label="Tên vai trò"
          name="roleName"
          rules={[{ required: true, message: 'Vui lòng nhập tên vai trò!' }]}>
          <Input placeholder="Nhập tên vai trò" />
        </Form.Item>

        <Divider>Quyền vai trò</Divider>

        <Row justify="space-between" style={{ marginBottom: 12 }}>
          <Col>Quyền truy cập của quản trị viên</Col>
          <Col>
            <Checkbox
              onChange={(e) => {
                if (e.target.checked) handleSelectAll();
                else setPermissions({});
              }}>
              Chọn tất cả
            </Checkbox>
          </Col>
        </Row>

        {features.map((feature) => (
          <Row key={feature.key} style={{ marginBottom: 12 }}>
            <Col span={8}>{feature.label}</Col>
            <Col span={16} style={{ textAlign: 'right' }}>
              <Checkbox.Group
                options={actions}
                value={permissions[feature.key]}
                onChange={(vals) => handleChange(feature.key, vals as string[])}
              />
            </Col>
          </Row>
        ))}

        <Form.Item style={{ textAlign: 'center', marginTop: 40 }}>
          <Button htmlType="submit" type="primary">
            Xác nhận
          </Button>{' '}
          <Button
            htmlType="reset"
            onClick={() => {
              form.resetFields();
              setPermissions({});
            }}>
            Hủy bỏ
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default RoleForm;
