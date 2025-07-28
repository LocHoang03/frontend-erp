import React, { useEffect, useMemo, useState } from 'react';
import {
  Row,
  Table,
  Space,
  Button,
  Popconfirm,
  Input,
  Modal,
  Form,
  message,
  Select,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import RoleForm from '@/components/feature-role';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import axios from 'axios';
import { Permission } from '@/redux/slice/permission';
import { UserContext } from '@/context/userContext';
import { defineAbilityFor } from '@/casl/ability';
import { Can } from '@/casl/Can';
import Detail from '@/components/detail-data';
import { errors, success } from '@/components/success-error-info';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import {
  createRole,
  deleteRole,
  getAllRole,
  updateRole,
} from '@/redux/slice/role';
import { useRouter } from 'next/router';
import { goToWithSearch } from '@/utils/router-helper';

export default function UserManagementPage({
  data,
  dataPermissions,
}: {
  data: any[];
  dataPermissions: Permission[];
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { user } = React.useContext(UserContext);

  const dataRoles = useAppSelector((state) => state.roles.dataRender);
  const router = useRouter();
  const { search, page, size } = router.query;

  const ability = useMemo(
    () => defineAbilityFor(user.userRole),
    [user.userRole],
  );

  useEffect(() => {
    dispatch(
      getAllRole({
        data: data,
        search: search,
      }),
    );
  }, [dispatch, data, search]);

  const handleSubmitCreate = async (dataCreate: any) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/roles/create`,
        dataCreate,
        {
          withCredentials: true,
        },
      );
      await dispatch(createRole(res.data));
      setIsLoading(false);
      success('Thêm vai trò mới thành công.', messageApi);
      setIsModalVisible(false);
      form.resetFields();
      setIsEdit(false);
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
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/roles/update`,
        dataCreate,
        {
          withCredentials: true,
        },
      );
      dispatch(updateRole(res.data));
      setIsLoading(false);
      success('Cập nhật vai trò thành công.', messageApi);
      setIsModalVisible(false);
      setIsEdit(false);
      form.resetFields();
    } catch (error: any) {
      errors(error.response.data.message, messageApi);
      setIsLoading(false);
      return;
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    try {
      setIsLoading(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/roles/delete`,
        { id: roleId },
        {
          withCredentials: true,
        },
      );
      dispatch(deleteRole(roleId));
      success('Xóa thành công.', messageApi);
    } catch (error: any) {
      errors(error.response.data.message, messageApi);
      return;
    }
  };

  const columns = [
    {
      title: 'Tên vai trò',
      dataIndex: 'name',
      width: '20%',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: '50%',
    },
    {
      title: 'Tổng số quyền',
      dataIndex: 'rolePermissions',
      render: (_: any, record: any) => (
        <span style={{ textAlign: 'center' }}>
          {record.rolePermissions?.length || 0} quyền
        </span>
      ),
      width: '20%',
    },
    {
      title: 'Hành Động',
      render: (value: any, record: any) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setDataDetail(record);
              setIsOpen(true);
            }}
          />
          {record['allow_delete'] && (
            <>
              <Can I="edit" a="roles" ability={ability}>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                    setIsEdit(true);
                    form.setFieldsValue({
                      name: record.name,
                      description: record.description,
                      id: record.id,
                      permission_id: record.rolePermissions.map(
                        (item: any) => item.permission_id,
                      ),
                    });
                    setIsModalVisible(true);
                  }}
                />
              </Can>
              <Can I="delete" a="roles" ability={ability}>
                <Popconfirm
                  title="Xác nhận xoá?"
                  onConfirm={() => handleDeleteRole(record.id)}>
                  <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Can>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Space>
          <Can I="create" a="roles" ability={ability}>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setIsModalVisible(true)}>
              Thêm vai trò mới
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
            placeholder="Tìm kiếm tên vai trò"
            allowClear
            enterButton
            onSearch={(value) => goToWithSearch(router, value, 1, 10)}
          />
          <Modal
            title="Thêm vai trò mới"
            open={isModalVisible}
            onCancel={() => {
              setIsModalVisible(false);
              setIsEdit(false);
              form.resetFields();
            }}
            footer={null}
            width={800}>
            <RoleForm
              onSuccess={() => {
                setIsModalVisible(false);
                setIsEdit(false);
                form.resetFields();
              }}
              form={form}
              isEdit={isEdit}
              isLoading={isLoading}
              handleSubmitCreate={handleSubmitCreate}
              handleEdit={handleSubmitEdit}
              dataPermissions={dataPermissions}
            />
          </Modal>

          <Modal
            title={`Thông tin chi tiết vai trò`}
            open={isOpen}
            onCancel={() => {
              setIsOpen(false);
            }}
            footer={null}
            width={600}>
            <Detail data={dataDetail} type="roles" />
          </Modal>
        </Space>
      </Row>

      <Table
        columns={columns}
        dataSource={dataRoles}
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
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/roles`,
  );
  const resPermission = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/permissions`,
  );
  return {
    props: {
      data: res.data,
      dataPermissions: resPermission.data,
    },
  };
};
