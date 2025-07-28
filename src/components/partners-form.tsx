import React from 'react';
import { Form, Input, Button, Card, FormInstance, Select } from 'antd';

import { MessageInstance } from 'antd/es/message/interface';

interface PartnerFormProps {
  onSuccess: () => void;
  handleSubmitCreate: (data: any) => void;
  handleEdit: (data: any) => void;
  isEdit: boolean;
  form: FormInstance;
  isLoading: boolean;
  errors: (msg: string, messageApi: MessageInstance) => void;
  messageApi: MessageInstance;
}

const PartnerForm: React.FC<PartnerFormProps> = ({
  onSuccess,
  handleSubmitCreate,
  handleEdit,
  isEdit,
  form,
  isLoading,
  errors,
  messageApi,
}) => {
  const handleSubmit = (values: any) => {
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    if (!phoneRegex.test(values.phone)) {
      errors('Số điện thoại không hợp lệ!!', messageApi);
      return;
    }
    const valueEntry = Object.fromEntries(
      Object.entries(values).filter(([_, v]) => v !== undefined),
    );
    if (!isEdit) handleSubmitCreate(valueEntry);
    else handleEdit(valueEntry);
  };

  return (
    <Card style={{ maxWidth: 800, margin: '0 auto' }}>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label="Họ tên (Tên công ty)"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
          <Input placeholder="Nhập họ tên" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' },
          ]}>
          <Input placeholder="Nhập email" type="email" />
        </Form.Item>

        <Form.Item
          label="Mã số thuế (nếu có)"
          name="tax_code"
          rules={[{ required: false, message: 'Vui lòng nhập mã số thuế!' }]}>
          <Input
            style={{ width: '100%' }}
            maxLength={12}
            placeholder="Nhập mã số thuế"
          />
        </Form.Item>

        <Form.Item
          label="Loại đối tác"
          name="type"
          rules={[{ required: true, message: 'Vui lòng chọn loại đối tác!' }]}>
          <Select
            showSearch
            placeholder="Chọn loại đối tác"
            options={[
              { label: 'Khách hàng', value: 'Khách hàng' },
              { label: 'Nhà cung cấp', value: 'Nhà cung cấp' },
            ]}
          />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center', marginTop: 40 }}>
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

export default PartnerForm;
