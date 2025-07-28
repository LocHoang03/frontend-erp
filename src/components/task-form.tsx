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
} from 'antd';
import styles from '@/styles/role-permission/permission.module.css';
import { LoadingOutlined } from '@ant-design/icons';
import { Project } from '@/redux/slice/project';

const { Title } = Typography;

interface FormProps {
  onSuccess: () => void;
  form: FormInstance;
  handleSubmitCreate: ({}: any) => void;
  handleSubmitUpdate: ({}: any) => void;
  handleChangeProject: ({}: any) => void;
  isLoading: boolean;
  isEdit: boolean;
  dataEmployees: any[];
  dataProjects: Project[];
}

const TasksForm: React.FC<FormProps> = ({
  onSuccess,
  form,
  handleSubmitCreate,
  handleSubmitUpdate,
  handleChangeProject,
  isLoading,
  isEdit,
  dataEmployees,
  dataProjects,
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
      {!dataEmployees ? (
        <div className={styles.loading}>
          <p>Vui lòng chờ...</p>
          <LoadingOutlined />
        </div>
      ) : (
        <>
          <Title level={3}>{`${isEdit ? 'Cập nhật ' : 'Thêm '}`}</Title>
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSubmit}
            onValuesChange={(changedValues, allValues) => {
              if ('project_id' in changedValues) {
                form.setFieldsValue({ assigned_employee_id: null });
              }
            }}
            initialValues={{ is_active: true }}>
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              label={`Tên công việc`}
              name="title"
              rules={[
                {
                  required: true,
                  message: `Vui lòng nhập tên công việc!`,
                },
              ]}>
              <Input placeholder="Nhập tên công việc" />
            </Form.Item>
            <Form.Item
              label={`Thuộc dự án`}
              name="project_id"
              rules={[
                {
                  required: true,
                  message: `Vui lòng chọn dự án!`,
                },
              ]}>
              <Select
                allowClear
                showSearch
                onChange={(value) => handleChangeProject(value)}
                placeholder="Chọn dự án"
                filterOption={(input, option) =>
                  (option?.label as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={(
                  dataProjects as {
                    id: number;
                    name: string;
                  }[]
                ).map((r) => ({
                  label: `${r.name}`,
                  value: r.id,
                }))}
                style={{ width: '100%' }}
              />
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
                placeholder="Chọn nhân sự"
                filterOption={(input, option) =>
                  (option?.label as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={(Array.isArray(dataEmployees) ? dataEmployees : [])
                  .filter((r) => r?.employee?.full_name && r?.employee?.email)
                  .map((r) => ({
                    label: `${r.employee?.full_name} (${r.employee?.email})`,
                    value: r.employee_id,
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
              label={`Hạn chót`}
              name="end_date"
              rules={[
                {
                  required: true,
                  message: `Vui lòng chọn hạn chót công việc!`,
                },
              ]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="Độ ưu tiên"
              name="priority"
              rules={[
                { required: true, message: 'Vui lòng chọn độ ưu tiên!' },
              ]}>
              <Select
                placeholder="Chọn độ ưu tiên"
                options={[
                  { value: 'Thấp', label: 'Thấp' },
                  { value: 'Trung bình', label: 'Trung bình' },
                  { value: 'Cao', label: 'Cao' },
                ]}
              />
            </Form.Item>

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
        </>
      )}
    </Card>
  );
};

export default TasksForm;
