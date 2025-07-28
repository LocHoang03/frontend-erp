import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  FormInstance,
  Row,
  DatePicker,
  TimePicker,
  Select,
} from 'antd';
import dayjs from 'dayjs';
import { Employee } from '@/redux/slice/employee';

const { Title } = Typography;

interface FormProps {
  onSuccess: () => void;
  form: FormInstance;
  handleSubmitCreate: ({}: any) => void;
  handleSubmitUpdate: ({}: any) => void;
  isLoading: boolean;
  isEdit: boolean;
  dataEmployees: Employee[];
  disabled: boolean;
  setDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const AttendancesForm: React.FC<FormProps> = ({
  onSuccess,
  form,
  handleSubmitCreate,
  handleSubmitUpdate,
  isLoading,
  isEdit,
  dataEmployees,
  disabled,
  setDisabled,
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
        onValuesChange={(changedValues, allValues) => {
          if ('check_in' in changedValues && !changedValues.check_in) {
            form.setFieldsValue({ check_out: null });
          }
        }}
        initialValues={{ is_active: true }}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label={`Tên nhân sự(email)`}
          name="employee_id"
          rules={[
            {
              required: true,
              message: `Vui lòng chọn nhân sự!`,
            },
          ]}>
          <Select
            allowClear
            showSearch
            onChange={(value) => {}}
            placeholder="Chọn nhân sự"
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
        <Form.Item
          label={`Ngày làm`}
          name="work_date"
          rules={[
            {
              required: true,
              message: `Vui lòng chọn ngày làm!`,
            },
          ]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Giờ vào làm"
          name="check_in"
          rules={[
            {
              required: false,
              message: 'Vui lòng chọn giờ vào làm!',
            },
          ]}>
          <TimePicker
            needConfirm={false}
            defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')}
            style={{ width: '100%' }}
            onChange={(value) => {
              console.log(value);
              form.setFieldsValue({
                check_in: value,
              });
              if (!value) {
                setDisabled(true);
              } else {
                setDisabled(false);
              }
            }}
          />
        </Form.Item>

        <Form.Item
          label="Giờ tan làm"
          name="check_out"
          rules={[
            {
              required: false,
              message: 'Vui lòng chọn giờ tan làm!',
            },
          ]}>
          <TimePicker
            needConfirm={false}
            onChange={(value) => {
              form.setFieldsValue({
                check_out: value,
              });
            }}
            defaultOpenValue={dayjs('00:00:00', 'HH:mm:ss')}
            style={{ width: '100%' }}
            disabled={disabled}
          />
        </Form.Item>

        <Form.Item
          label={`Mô tả`}
          name="note"
          rules={[
            {
              required: false,
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

export default AttendancesForm;
