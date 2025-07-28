import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  FormInstance,
  Select,
  DatePicker,
  Upload,
  InputNumber,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface EmployeeFormProps {
  onSuccess: () => void;
  handleSubmitCreate: (formData: FormData) => void;
  handleEdit: (formData: FormData) => void;
  isEdit: boolean;
  form: FormInstance;
  dataDepartments: any[];
  dataPositions: any[];
  isLoading: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  onSuccess,
  handleSubmitCreate,
  handleEdit,
  isEdit,
  form,
  dataDepartments,
  dataPositions,
  isLoading,
}) => {
  const handleSubmit = (values: any) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
      if (value === undefined || value === null) continue;
      if (key === 'avatar_url') {
        const file = (value as any)?.file?.originFileObj;
        if (file instanceof Blob) {
          formData.append('avatar_url', file);
        }
      } else if (key === 'birth_date') {
        if (dayjs.isDayjs(value)) {
          formData.append('birth_date', value.format('YYYY-MM-DD'));
        }
      } else {
        if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean'
        ) {
          formData.append(key, value.toString());
        } else {
          formData.append(key, JSON.stringify(value));
        }
      }
    }

    if (isEdit) {
      handleEdit(formData);
    } else {
      handleSubmitCreate(formData);
    }
  };

  return (
    <Card style={{ maxWidth: 800, margin: '0 auto' }}>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item label="Họ tên" name="full_name" hidden={true}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Họ tên"
          name="full_name"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}>
          <Input placeholder="Nhập họ tên" />
        </Form.Item>
        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
          <Select
            // onChange={handleChange}
            placeholder="Chọn giới tính"
            options={[
              { value: 'Nam', label: 'Nam' },
              { value: 'Nữ', label: 'Nữ' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Ngày sinh"
          name="birth_date"
          rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
          <DatePicker
            style={{ width: '100%' }}
            // onChange={onChange}
            needConfirm
          />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phone_number"
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
          label="Ảnh nhân sự"
          name="avatar_url"
          rules={[
            {
              required: !isEdit ? true : false,
              message: 'Vui lòng chọn file ảnh!',
            },
          ]}>
          <Upload
            style={{ width: '100%' }}

            // {...props}
          >
            <Button icon={<UploadOutlined />} style={{ width: '100% ' }}>
              Bấm để tải lên
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Trạng thái nhân sự"
          name="status"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
          <Select
            style={{ width: '100%' }}
            placeholder="Chọn trạng thái"
            // onChange={handleChange}
            options={[
              { value: 'Thử việc', label: 'Thử việc' },
              { value: 'Đang làm', label: 'Đang làm' },
              { value: 'Nghỉ phép', label: 'Nghỉ phép' },
              { value: 'Tạm nghỉ', label: 'Tạm nghỉ' },
              { value: 'Đã nghỉ', label: 'Đã nghỉ' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Căn cước công dân nhân sự"
          name="national_id"
          rules={[
            { required: true, message: 'Vui lòng nhập số căn cước công dân!' },
          ]}>
          <Input
            style={{ width: '100%' }}
            maxLength={12}
            placeholder="Nhập số căn cước công dân"
          />
        </Form.Item>

        <Form.Item
          label="Phòng ban"
          name="department_id"
          rules={[{ required: false, message: 'Vui lòng chọn phòng ban!' }]}>
          <Select
            showSearch
            placeholder="Chọn phòng ban"
            options={(dataDepartments as { id: number; name: string }[]).map(
              (r) => ({
                label: r.name,
                value: r.id,
              }),
            )}
            filterOption={(input, option) =>
              (option?.label as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
          />
        </Form.Item>

        <Form.Item
          label="Vị trí công việc"
          name="position_id"
          rules={[
            { required: false, message: 'Vui lòng chọn vị trí công việc!' },
          ]}>
          <Select
            showSearch
            placeholder="Chọn vị trí công việc"
            options={(dataPositions as { id: number; name: string }[]).map(
              (r) => ({
                label: r.name,
                value: r.id,
              }),
            )}
            filterOption={(input, option) =>
              (option?.label as string)
                .toLowerCase()
                .includes(input.toLowerCase())
            }
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

export default EmployeeForm;
