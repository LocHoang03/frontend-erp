import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Space,
  Table,
  Popconfirm,
  message,
  Modal,
  Form,
  Spin,
  Select,
  Input,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import {
  createUser,
  deleteUser,
  getAllUser,
  updateUser,
} from '@/redux/slice/users';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import axios from 'axios';
import UserForm from '@/components/user-form';
import { getAllRole } from '@/redux/slice/role';
import { errors, success } from '@/components/success-error-info';
import { Employee } from '@/redux/slice/employee';
import { UserContext } from '@/context/userContext';
import styles from '@/styles/layout.module.css';
import { defineAbilityFor } from '@/casl/ability';
import { Can } from '@/casl/Can';
import Detail from '@/components/detail-data';
import { goToWithSearch } from '@/utils/router-helper';
import { useRouter } from 'next/router';
export default function Accounts({
  data,
  dataRoles,
  dataEmployees,
}: {
  data: [];
  dataRoles: [];
  dataEmployees: Employee[];
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [dataDetail, setDataDetail] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const dataUser = useAppSelector((state) => state.users.dataRender);
  const dataRole = useAppSelector((state) => state.roles.dataRender);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { search, page, size } = router.query;

  const [form] = Form.useForm();

  const { user } = React.useContext(UserContext);

  const [messageApi, contextHolder] = message.useMessage();

  const ability = useMemo(
    () => defineAbilityFor(user.userRole),
    [user.userRole],
  );

  useEffect(() => {
    dispatch(getAllUser({ data: data, search: search }));
    dispatch(getAllRole({ data: dataRoles, search: undefined }));
  }, [dispatch, data, dataRoles, search]);

  const handleModeChange = (value: 'auto' | 'manual') => {
    setMode(value);
  };

  const handleDeleteRow = async (record: any) => {
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/users/delete`,
      {
        id: record.id,
      },
      {
        withCredentials: true,
      },
    );
    dispatch(deleteUser(record));

    success('Vô hiệu hóa tài khoản thành công.', messageApi);
  };

  const handleReset = async (record: any) => {
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/users/reset`,
      {
        id: record.id,
      },
      {
        withCredentials: true,
      },
    );

    success('Cập nhật mật khẩu mới tài khoản thành công.', messageApi);
  };

  const handleSubmitCreate = async (dataCreate: any) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/users/create`,
        dataCreate,
        {
          withCredentials: true,
        },
      );
      dispatch(createUser(res.data));
      setIsLoading(false);
      success('Thêm tài khoản mới thành công.', messageApi);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      errors(error.response.data.message, messageApi);
      setIsLoading(false);
      return;
    }
  };

  const handleSubmitEdit = async (dataCreate: any) => {
    try {
      setIsLoading(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/users/update`,
        dataCreate,
        {
          withCredentials: true,
        },
      );
      dispatch(updateUser(res.data));
      setIsLoading(false);
      success('Cập nhật tài khoản mới thành công.', messageApi);
      setIsModalVisible(false);
      setIsEdit(false);
      form.resetFields();
    } catch (error: any) {
      errors(error.response.data.message, messageApi);
      setIsLoading(false);
      return;
    }
  };
  const columns = [
    {
      title: 'Tên tài khoản',
      dataIndex: 'username',
      width: '20%',
    },
    {
      title: 'Thuộc nhân sự',
      dataIndex: 'employee.full_name',
      width: '30%',
      render: (_: any, record: any) => {
        return <span>{record.employee.full_name}</span>;
      },
    },
    {
      title: 'email',
      dataIndex: 'employee.email',
      width: '30%',
      render: (_: any, record: any) => {
        return <span>{record.employee.email}</span>;
      },
    },
    {
      title: 'Actions',
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
          <Can I="edit" a="manage-accounts" ability={ability}>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setIsEdit(true);
                form.setFieldsValue({
                  id: record.id,
                  username: record.username,
                  assigned_employee_id: record.employee.id,
                  role_id: record.userRole.map((ur: any) => ur.role_id),
                });
                setIsModalVisible(true);
              }}
            />
          </Can>

          <Can I="edit" a="manage-accounts" ability={ability}>
            <Popconfirm
              title="Làm mới mật khẩu cho tài khoản này?"
              onConfirm={() => handleReset(record)}>
              <Button color="yellow" icon={<SyncOutlined />} />
            </Popconfirm>
          </Can>

          <Can I="delete" a="manage-accounts" ability={ability}>
            <Popconfirm
              title="Xoá tài khoản?"
              onConfirm={() => handleDeleteRow(record)}>
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Can>
        </Space>
      ),
    },
  ];

  if (!user)
    return (
      <div className={styles.loadingGlobal}>
        <p>Vui lòng chờ...</p>
        <Spin size="large" />
      </div>
    );

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <h2 style={{ marginBottom: 16 }}>Quản lý tài khoản người dùng</h2>
      <Space style={{ marginBottom: 16 }}>
        <Can I="create" a="manage-accounts" ability={ability}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}>
            Thêm mới
          </Button>
        </Can>
        <span>Trình diễn</span>
        <Select
          defaultValue="10"
          onChange={(value) => {
            const searchFilter = Array.isArray(search)
              ? search[0]
              : search ?? '';
            goToWithSearch(router, searchFilter, 1, Number(value));
          }}>
          <Select.Option value="10">10</Select.Option>
          <Select.Option value="20">20</Select.Option>
          <Select.Option value="50">50</Select.Option>
        </Select>
        <Input.Search
          placeholder="Tìm kiếm theo tên tài khoản hoặc email"
          allowClear
          enterButton
          className="search-input"
          onSearch={(value) => goToWithSearch(router, value, 1, 10)}
        />
        <Modal
          title={`${isEdit ? 'Cập nhật tài khoản' : 'Thêm mới'}`}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setMode('auto');
            form.resetFields();
            setIsEdit(false);
          }}
          footer={null}
          width={800}>
          <UserForm
            onSuccess={() => {
              setIsModalVisible(false);
              form.resetFields();
              setIsEdit(false);
              setMode('auto');
            }}
            dataEmployees={dataEmployees}
            dataRole={dataRole}
            handleSubmitCreate={handleSubmitCreate}
            handleEdit={handleSubmitEdit}
            isEdit={isEdit}
            isLoading={isLoading}
            form={form}
            mode={mode}
            handleModeChange={handleModeChange}
          />
        </Modal>
        <Modal
          title={`Thông tin chi tiết tài khoản`}
          open={isOpen}
          onCancel={() => {
            setIsOpen(false);
          }}
          footer={null}
          width={600}>
          <Detail data={dataDetail} type="manage-accounts" />
        </Modal>
      </Space>
      <Table
        columns={columns}
        dataSource={dataUser}
        pagination={{
          pageSize: Number(size) || 10,
          current: Number(page) || 1,
          showSizeChanger: false,
          onChange: (page: number, pageSize: number) => {
            const searchFilter = Array.isArray(search)
              ? search[0]
              : search ?? '';
            const sizeFilter = Number(size) || 10;
            goToWithSearch(router, searchFilter, page, sizeFilter);
          },
        }}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/users`,
  );
  const resRoles = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/roles`,
  );
  const resEmployees = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/employees`,
  );
  return {
    props: {
      data: res.data,
      dataRoles: resRoles.data,
      dataEmployees: resEmployees.data,
    },
  };
};
