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
  Space,
} from 'antd';
import { Employee } from '@/redux/slice/employee';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

interface FormProps {
  onSuccess: () => void;
  form: FormInstance;
  handleSubmitCreate: ({}: any) => void;
  handleSubmitUpdate: ({}: any) => void;
  isLoading: boolean;
  isEdit: boolean;
  dataEmployees: Employee[];
  disabled: number | undefined;
  setDisabled: React.Dispatch<React.SetStateAction<number | undefined>>;
  disabledMember: number[];
  setDisabledMember: React.Dispatch<React.SetStateAction<number[]>>;
}

const ProjectsForm: React.FC<FormProps> = ({
  onSuccess,
  form,
  handleSubmitCreate,
  handleSubmitUpdate,
  isLoading,
  isEdit,
  dataEmployees,
  disabled,
  setDisabled,
  disabledMember,
  setDisabledMember,
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
          if ('owner_id' in changedValues && !changedValues.owner_id) {
            form.setFieldsValue({ project_member: [] });
            setDisabled(0);
            setDisabledMember([]);
          }
        }}
        initialValues={{ is_active: true }}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label={`Tên dự án`}
          name="name"
          rules={[
            {
              required: true,
              message: `Vui lòng nhập tên dự án!`,
            },
          ]}>
          <Input placeholder="Nhập tên dự án" />
        </Form.Item>
        <Form.Item
          label={`Quản lý dự án (email)`}
          name="owner_id"
          rules={[
            {
              required: true,
              message: `Vui lòng chọn quản lý dự án!`,
            },
          ]}>
          <Select
            allowClear
            showSearch
            onChange={(value) => {
              setDisabled(value);
            }}
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
              disabled: disabledMember.includes(r.id),
            }))}
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item
          label={`Ngày bắt đầu`}
          name="start_date"
          rules={[
            {
              required: true,
              message: `Vui lòng chọn ngày bắt đầu!`,
            },
          ]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label={`Ngày kết thúc`}
          name="end_date"
          rules={[
            {
              required: false,
              message: `Vui lòng chọn ngày kết thúc!`,
            },
          ]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <span>Thành viên tham gia</span>
        <div style={{ marginTop: '10px' }}></div>
        <Form.List name="project_member">
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    align="baseline"
                    style={{ display: 'flex', marginBottom: 8 }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'employee_id']}
                      rules={[{ required: true, message: 'Chọn nhân sự!' }]}>
                      <Select
                        showSearch
                        filterOption={(input, option) =>
                          (option?.label as string)
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        onChange={(value) => {
                          setDisabledMember((prev) => [...prev, value]);
                        }}
                        placeholder="Chọn nhân sự"
                        options={(
                          dataEmployees as {
                            id: number;
                            full_name: string;
                            email: string;
                          }[]
                        ).map((r) => ({
                          label: r.full_name + ` (${r.email})`,
                          value: r.id,
                          disabled:
                            r.id === disabled || disabledMember.includes(r.id),
                        }))}
                        style={{ width: 300 }}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'role_in_project']}
                      rules={[{ required: true, message: 'Nhập vai trò!' }]}>
                      <Input
                        placeholder="Vai trò"
                        min={0}
                        style={{ width: 300 }}
                      />
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    block>
                    Thêm thành viên
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
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

export default ProjectsForm;
