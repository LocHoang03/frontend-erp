import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Popconfirm,
  Modal,
  Form,
  message,
} from 'antd';
import {
  CheckCircleOutlined,
  EditOutlined,
  EyeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import axios from 'axios';
import styles from '@/styles/role-permission/permission.module.css';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { errors, success } from '@/components/success-error-info';
import dayjs from 'dayjs';
import { Employee } from '@/redux/slice/employee';
import { Project } from '@/redux/slice/project';
import StatusTag from '@/components/status-tag';
import {
  confirmTask,
  createTask,
  getAllTask,
  Task,
  updateTask,
} from '@/redux/slice/task';
import TasksForm from '@/components/task-form';
import { UserContext } from '@/context/userContext';
import { defineAbilityFor } from '@/casl/ability';
import { Can } from '@/casl/Can';
import Detail from '@/components/detail-data';
import { useRouter } from 'next/router';
import { goToWithSearchTask } from '@/utils/router-helper';

const { Option } = Select;

const statusColors = {
  'Đang làm': 'orange',
  'Đã hoàn thành': 'green',
  'Quá hạn': 'red',
};
const priorityColors = {
  ['Thấp']: 'blue',
  ['Trung bình']: 'gold',
  ['Cao']: 'red',
};

export default function TasksPage({
  data,
  dataEmployees,
  dataProjects,
}: {
  data: Task[];
  dataEmployees: Employee[];
  dataProjects: Project[];
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [employeesData, setEmployeesData] = useState<any[]>([]);
  const [dataDetail, setDataDetail] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { search, page, size, status, priority } = router.query;
  const searchFilter = Array.isArray(search) ? search[0] : search ?? '';
  const statusFilter = Array.isArray(status) ? status[0] : status ?? '';
  const priorityFilter = Array.isArray(priority) ? priority[0] : priority ?? '';

  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const dataTasks = useAppSelector((state) => state.tasks.dataRender);

  const { user } = React.useContext(UserContext);

  const ability = useMemo(
    () => defineAbilityFor(user.userRole),
    [user.userRole],
  );

  useEffect(() => {
    dispatch(
      getAllTask({
        data: data,
        search: searchFilter,
        status: statusFilter,
        priority: priorityFilter,
      }),
    );
  }, [dispatch, data, searchFilter, statusFilter, priorityFilter]);

  const handleSubmitCreate = async (dataCreate: any) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/tasks/create`,
        dataCreate,
        {
          withCredentials: true,
        },
      );
      dispatch(createTask(res.data));
      setIsLoading(false);
      success('Thêm mới thành công.', messageApi);
      setIsModalVisible(false);

      form.resetFields();
      setIsEdit(false);
    } catch (error: any) {
      errors(error.response.data.message, messageApi);
      setIsLoading(false);
      return;
    }
  };

  const handleSubmitUpdate = async (dataCreate: any) => {
    try {
      setIsLoading(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/tasks/update`,
        dataCreate,
        {
          withCredentials: true,
        },
      );
      dispatch(updateTask(res.data));
      setIsLoading(false);

      setIsEdit(false);
      success('Cập nhật thành công.', messageApi);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      errors(error.response.data.message, messageApi);
      setIsLoading(false);
      return;
    }
  };

  const handleConfirm = async (record: any) => {
    try {
      setIsLoading(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/tasks/confirm`,
        { id: record.id },
        {
          withCredentials: true,
        },
      );
      dispatch(confirmTask(record.id));
      success('Xác nhận thành công.', messageApi);
    } catch (error: any) {
      errors(error.response.data.message, messageApi);
      return;
    }
  };

  const handleChangeProject = async (id: number) => {
    const data = dataProjects.find((dt) => dt.id === id)?.members || [];
    setEmployeesData(data);
  };

  const columns = [
    {
      title: 'Tên công việc',
      dataIndex: 'title',
    },
    {
      title: 'Thuộc dự án',
      dataIndex: 'project',
      render: (_: any, record: any) => {
        return <span>{record.project.name}</span>;
      },
    },
    {
      title: 'Được giao cho',
      dataIndex: 'assigned_employee',
      render: (_: any, record: any) => {
        return <span>{record.assigned_employee.full_name}</span>;
      },
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_date',
      render: (_: any, record: any) => {
        return <span>{dayjs(record.start_date).format('DD/MM/YYYY')}</span>;
      },
    },
    {
      title: 'Hạn chót',
      dataIndex: 'end_date',
      render: (_: any, record: any) => {
        return (
          <span>
            {record.end_date
              ? dayjs(record.end_date).format('DD/MM/YYYY')
              : 'Chưa xác định'}
          </span>
        );
      },
    },

    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      render: (_: any, record: any) => {
        return (
          <StatusTag
            colorMap={priorityColors}
            status={record.priority}
            defaultColor="white"
          />
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (_: any, record: any) => {
        return (
          <StatusTag
            colorMap={statusColors}
            status={record.status}
            defaultColor="white"
          />
        );
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setDataDetail(record);
              setIsOpen(true);
            }}
          />
          {record.status === 'Đang làm ' && (
            <>
              <Can I="edit" a="tasks" ability={ability}>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                    setIsEdit(true);

                    form.setFieldsValue({
                      title: record.title,
                      project_id: record.project.id,
                      assigned_employee_id: record.assigned_employee.id,
                      start_date: dayjs(record.start_date),
                      end_date: record.end_date ? dayjs(record.end_date) : null,
                      priority: record.priority,
                      description: record.description,
                      id: record.id,
                    });
                    setIsModalVisible(true);
                  }}
                />
              </Can>
              <Can I="edit" a="tasks" ability={ability}>
                <Popconfirm
                  title="Xác nhận đã hoàn thành dự án?"
                  onConfirm={() => handleConfirm(record)}>
                  <Button danger icon={<CheckCircleOutlined />} />
                </Popconfirm>
              </Can>
            </>
          )}
        </Space>
      ),
    },
  ];

  if (!dataProjects || !employeesData) {
    return (
      <div className={styles.loading}>
        <p>Vui lòng chờ...</p>
        <LoadingOutlined />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <Space style={{ marginBottom: 16 }} wrap>
        <span>Trình diễn</span>
        <Select
          defaultValue="10"
          onChange={(value) => {
            goToWithSearchTask(
              router,
              searchFilter,
              1,
              Number(value),
              statusFilter,
              priorityFilter,
            );
          }}>
          <Option value="10">10</Option>
          <Option value="20">20</Option>
          <Option value="50">50</Option>
        </Select>
        <Input.Search
          className="search-input-task"
          placeholder="Công việc/dự án/người thực hiện"
          allowClear
          enterButton
          onSearch={(value) =>
            goToWithSearchTask(
              router,
              value,
              1,
              Number(size),
              statusFilter,
              priorityFilter,
            )
          }
        />{' '}
        <Select
          allowClear
          onChange={(value) =>
            goToWithSearchTask(
              router,
              searchFilter,
              1,
              Number(size),
              value,
              priorityFilter,
            )
          }
          placeholder="Chọn trạng thái"
          options={[
            { value: 'all', label: 'Tất cả' },
            { value: 'Đang làm', label: 'Đang làm' },
            { value: 'Đã hoàn thành', label: 'Đã hoàn thành' },
            { value: 'Quá hạn', label: 'Quá hạn' },
          ]}
        />
        <Select
          allowClear
          onChange={(value) =>
            goToWithSearchTask(
              router,
              searchFilter,
              1,
              Number(size),
              statusFilter,
              value,
            )
          }
          placeholder="Chọn độ ưu tiên"
          options={[
            { value: 'all', label: 'Tất cả' },
            { value: 'Thấp', label: 'Thấp' },
            { value: 'Trung bình', label: 'Trung bình' },
            { value: 'Cao', label: 'Cao' },
          ]}
        />
        <Can I="create" a="tasks" ability={ability}>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Thêm mới
          </Button>
        </Can>
        <Modal
          title={`${isEdit ? 'Cập nhật' : 'Thêm mới'}`}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setIsEdit(false);

            form.resetFields();
          }}
          footer={null}
          width={800}>
          <TasksForm
            onSuccess={() => {
              setIsModalVisible(false);
              setIsEdit(false);
              form.resetFields();
            }}
            handleChangeProject={handleChangeProject}
            handleSubmitCreate={handleSubmitCreate}
            handleSubmitUpdate={handleSubmitUpdate}
            isEdit={isEdit}
            isLoading={isLoading}
            form={form}
            dataEmployees={employeesData}
            dataProjects={dataProjects}
          />
        </Modal>{' '}
        <Modal
          title={`Thông tin chi tiết công việc`}
          open={isOpen}
          onCancel={() => {
            setIsOpen(false);
          }}
          footer={null}
          width={400}>
          <Detail data={dataDetail} type="tasks" />
        </Modal>
      </Space>
      <Table
        columns={columns}
        dataSource={dataTasks}
        pagination={{
          pageSize: Number(size) || 10,
          current: Number(page) || 1,
          showSizeChanger: false,
          onChange: (page: number, pageSize: number) => {
            const searchFilter = Array.isArray(search)
              ? search[0]
              : search ?? '';
            const sizeFilter = Number(size) || 10;
            goToWithSearchTask(
              router,
              searchFilter,
              page,
              sizeFilter,
              statusFilter,
              priorityFilter,
            );
          },
        }}
        rowKey="key"
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/tasks`,
  );
  const resEmployees = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/employees`,
  );
  const resProjects = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/projects`,
  );
  return {
    props: {
      data: res.data,
      dataEmployees: resEmployees.data,
      dataProjects: resProjects.data,
    },
  };
};
