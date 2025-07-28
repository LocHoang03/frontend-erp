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
  DeleteOutlined,
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
import ProjectsForm from '@/components/project-form';
import {
  createProject,
  getAllProject,
  Project,
  removeProject,
  updateProject,
} from '@/redux/slice/project';
import StatusTag from '@/components/status-tag';
import { UserContext } from '@/context/userContext';
import { defineAbilityFor } from '@/casl/ability';
import { Can } from '@/casl/Can';
import Detail from '@/components/detail-data';
import { useRouter } from 'next/router';
import { goToWithSearchProject } from '@/utils/router-helper';

const { Option } = Select;

const statusColors = {
  'Đang triển khai': 'blue',
  'Đã hoàn thành': 'green',
  'Trễ hạn': 'red',
  'Loại bỏ': 'gray',
};

export default function ProjectsPage({
  data,
  dataEmployees,
}: {
  data: Project[];
  dataEmployees: Employee[];
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [disabled, setDisabled] = useState<number | undefined>(0);
  const [disabledMember, setDisabledMember] = useState<number[]>([]);
  const [dataDetail, setDataDetail] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { search, page, size, status } = router.query;
  const searchFilter = Array.isArray(search) ? search[0] : search ?? '';
  const statusFilter = Array.isArray(status) ? status[0] : status ?? '';

  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const dataProjects = useAppSelector((state) => state.projects.dataRender);

  const { user } = React.useContext(UserContext);

  const ability = useMemo(
    () => defineAbilityFor(user.userRole),
    [user.userRole],
  );

  useEffect(() => {
    dispatch(
      getAllProject({ data: data, search: searchFilter, status: statusFilter }),
    );
  }, [dispatch, data, searchFilter, statusFilter]);

  const handleSubmitCreate = async (dataCreate: any) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/projects/create`,
        dataCreate,
        {
          withCredentials: true,
        },
      );
      dispatch(createProject(res.data));
      setIsLoading(false);
      success('Thêm mới thành công.', messageApi);
      setIsModalVisible(false);
      setDisabled(0);
      setDisabledMember([]);
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
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/projects/update`,
        dataCreate,
        {
          withCredentials: true,
        },
      );
      dispatch(updateProject(res.data));
      setIsLoading(false);
      setDisabled(0);

      setIsEdit(false);
      success('Cập nhật thành công.', messageApi);
      setIsModalVisible(false);
      form.resetFields();
      setDisabled(0);
      setDisabledMember([]);
    } catch (error: any) {
      errors(error.response.data.message, messageApi);
      setIsLoading(false);
      return;
    }
  };

  const handleRemove = async (record: any) => {
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/projects/remove`,
        { id: record.id },
        {
          withCredentials: true,
        },
      );
      await dispatch(removeProject(record.id));
      success('Loại bỏ thành công.', messageApi);
    } catch (error: any) {
      errors(error.response.data.message, messageApi);
      return;
    }
  };

  const columns = [
    {
      title: 'Tên dự án',
      dataIndex: 'name',
    },
    {
      title: 'Quản lý dự án',
      dataIndex: 'employee',
      render: (_: any, record: any) => {
        return <span>{record.employee.full_name}</span>;
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
      title: 'Ngày kết thúc',
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
      title: 'Số thành viên',
      dataIndex: 'members',
      render: (_: any, record: any) => {
        return <span>{record.members.length || 0}</span>;
      },
    },
    {
      title: 'Số lượng công việc',
      dataIndex: 'tasks',
      render: (_: any, record: any) => {
        return <span>{record.tasks.length || 0}</span>;
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
      title: 'Ghi chú',
      dataIndex: 'note',
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
          <Can I="edit" a="projects" ability={ability}>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setIsEdit(true);
                setDisabled(record.employee.id);
                if (record.members) {
                  const newIds = record.members.map((m: any) => m.employee_id);

                  setDisabledMember((prev) => [...prev, ...newIds]);
                }
                form.setFieldsValue({
                  name: record.name,
                  owner_id: record.employee.id,
                  start_date: dayjs(record.start_date),
                  end_date: record.end_date ? dayjs(record.end_date) : null,
                  project_member: record.members
                    ? record.members.map((mb: any) => {
                        return {
                          employee_id: mb.employee_id,
                          role_in_project: mb.role_in_project,
                        };
                      })
                    : null,
                  description: record.description,
                  id: record.id,
                });
                setIsModalVisible(true);
              }}
            />
          </Can>

          <Can I="delete" a="projects" ability={ability}>
            <Popconfirm
              title="Loại bỏ dự án này?"
              onConfirm={() => handleRemove(record)}>
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Can>
        </Space>
      ),
    },
  ];

  if (!dataProjects) {
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
            goToWithSearchProject(
              router,
              searchFilter,
              1,
              Number(value),
              statusFilter,
            );
          }}>
          <Option value="10">10</Option>
          <Option value="20">20</Option>
          <Option value="50">50</Option>
        </Select>
        <Input.Search
          placeholder="Tên dự án hoặc chủ dự án"
          allowClear
          enterButton
          onSearch={(value) =>
            goToWithSearchProject(router, value, 1, Number(size), statusFilter)
          }
        />{' '}
        <Select
          allowClear
          onChange={(value) =>
            goToWithSearchProject(router, searchFilter, 1, Number(size), value)
          }
          placeholder="Chọn trạng thái"
          options={[
            { value: 'all', label: 'Tất cả' },
            { value: 'Đang triển khai', label: 'Đang triển khai' },
            { value: 'Đã hoàn thành', label: 'Đã hoàn thành' },
            { value: 'Trễ hạn', label: 'Trễ hạn' },
            { value: 'Loại bỏ', label: 'Loại bỏ' },
          ]}
        />
        <Can I="create" a="projects" ability={ability}>
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
            setDisabled(0);
            setDisabledMember([]);
            form.resetFields();
          }}
          footer={null}
          width={800}>
          <ProjectsForm
            onSuccess={() => {
              setIsModalVisible(false);
              setIsEdit(false);
              setDisabled(0);
              setDisabledMember([]);
              form.resetFields();
            }}
            handleSubmitCreate={handleSubmitCreate}
            handleSubmitUpdate={handleSubmitUpdate}
            isEdit={isEdit}
            isLoading={isLoading}
            form={form}
            dataEmployees={dataEmployees}
            disabled={disabled}
            disabledMember={disabledMember}
            setDisabled={setDisabled}
            setDisabledMember={setDisabledMember}
          />
        </Modal>{' '}
        <Modal
          title={`Thông tin chi tiết dự án`}
          open={isOpen}
          onCancel={() => {
            setIsOpen(false);
          }}
          footer={null}
          width={400}>
          <Detail data={dataDetail} type="projects" />
        </Modal>
      </Space>
      <Table
        columns={columns}
        dataSource={dataProjects}
        pagination={{
          pageSize: Number(size) || 10,
          current: Number(page) || 1,
          showSizeChanger: false,
          onChange: (page: number, pageSize: number) => {
            const searchFilter = Array.isArray(search)
              ? search[0]
              : search ?? '';
            const sizeFilter = Number(size) || 10;
            goToWithSearchProject(
              router,
              searchFilter,
              page,
              sizeFilter,
              statusFilter,
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
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/projects`,
  );
  const resEmployees = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/employees`,
  );
  return {
    props: {
      data: res.data,
      dataEmployees: resEmployees.data,
    },
  };
};
