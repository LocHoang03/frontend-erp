import React from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  FormInstance,
  DatePicker,
  Select,
  InputNumber,
} from 'antd';
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

const SalariesForm: React.FC<FormProps> = ({
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
    console.log(values);
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
          label={`Kỳ lương`}
          name="salary_month"
          rules={[
            {
              required: true,
              message: `Vui lòng chọn kỳ lương!`,
            },
          ]}>
          <DatePicker style={{ width: '100%' }} picker="month" />
        </Form.Item>
        <Form.Item
          label={`Lương cơ bản`}
          name="base_salary"
          rules={[
            {
              required: true,
              message: `Vui lòng nhập lương cơ bản!`,
            },
          ]}>
          <InputNumber
            placeholder="Nhập lương cơ bản"
            style={{ width: '100%' }}
            min={0}
          />
        </Form.Item>
        <Form.Item
          label={`Thưởng thêm`}
          name="bonus"
          rules={[
            {
              required: true,
              message: `Vui lòng nhập lương thưởng thêm!`,
            },
          ]}>
          <InputNumber
            placeholder="Nhập lương thưởng thêm"
            min={0}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          label={`Trợ cấp`}
          name="allowance"
          rules={[
            {
              required: true,
              message: `Vui lòng nhập số tiền trợ cấp thêm!`,
            },
          ]}>
          <InputNumber
            placeholder="Nhập nhập số tiền trợ cấp thêm"
            min={0}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          label={`Khấu trừ`}
          name="deduction"
          rules={[
            {
              required: true,
              message: `Vui lòng nhập số tiền khấu trừ!`,
            },
          ]}>
          <InputNumber
            placeholder="Nhập nhập số tiền khấu trừ"
            min={0}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          label={`Mô tả`}
          name="note"
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

export default SalariesForm;
