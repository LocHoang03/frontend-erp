import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Popconfirm,
  Modal,
  message,
  Form,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import StatusTag from '@/components/status-tag';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import styles from '@/styles/role-permission/permission.module.css';
import { errors, success } from '@/components/success-error-info';
import { EmployeeStatus } from '@/redux/slice/employee';
import type { ColumnsType } from 'antd/es/table';
import PartnerForm from '@/components/partners-form';
import {
  createPartner,
  deletePartner,
  getAllPartner,
  Partner,
  updatePartner,
} from '@/redux/slice/partner';
import { defineAbilityFor } from '@/casl/ability';
import { UserContext } from '@/context/userContext';
import { Can } from '@/casl/Can';
import Detail from '@/components/detail-data';
import { useRouter } from 'next/router';
import { goToWithSearchPartner } from '@/utils/router-helper';

const { Search } = Input;

const typeColors = {
  'Khách hàng': 'blue',
  'Đối tác': 'purple',
};

export interface Employee {
  id: number;
  full_name: string;
  gender: 'Nam' | 'Nữ';
  birth_date?: string;
  address?: string;
  phone_number?: string;
  email?: string;
  avatar_url?: string;
  status?: EmployeeStatus;
  national_id: string;
  department_id?: number;
  position_id?: number;
  department?: {};
  position?: {};
}

export default function PartnersPage({ data }: { data: [] }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { search, page, size, type } = router.query;
  const searchFilter = Array.isArray(search) ? search[0] : search ?? '';
  const typeFilter = Array.isArray(type) ? type[0] : type ?? '';

  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const dataPartners = useAppSelector((state) => state.partners.dataRender);

  const { user } = React.useContext(UserContext);

  const ability = useMemo(
    () => defineAbilityFor(user.userRole),
    [user.userRole],
  );

  useEffect(() => {
    dispatch(getAllPartner({ data: data, search: search, type: type }));
  }, [dispatch, data, search]);

  const columns: ColumnsType<Partner> = [
    {
      title: 'Họ tên',
      dataIndex: 'name',
    },

    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
    },
    {
      title: 'Mã số thuế',
      dataIndex: 'tax_code',
    },
    {
      title: 'Loại đối tác',
      dataIndex: 'type',
      render: (type) => (
        <StatusTag status={type} colorMap={typeColors} defaultColor="default" />
      ),
    },

    {
      title: 'Hành động',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setDataDetail(record);
              setIsOpen(true);
            }}
          />
          <Can I="edit" a="partners" ability={ability}>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setIsEdit(true);
                form.setFieldsValue({
                  id: record.id,
                  name: record.name,
                  email: record.email,
                  phone: record.phone,
                  address: record.address,
                  tax_code: record.tax_code,
                  type: record.type,
                });
                setIsModalVisible(true);
              }}
            />
          </Can>
          <Can I="delete" a="partners" ability={ability}>
            <Popconfirm
              title="Xóa đối tác này?"
              onConfirm={() => handleDeleteRow(record)}>
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Can>
        </Space>
      ),
    },
  ];

  const handleSubmitCreate = async (formData: FormData) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/partners/create`,
        formData,
        {
          withCredentials: true,
        },
      );
      await dispatch(createPartner(res.data));
      setIsLoading(false);
      setIsEdit(false);
      success('Thêm nhân sự mới thành công.', messageApi);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      if (!Array.isArray(error.response.data.message))
        errors(error.response.data.message, messageApi);
      else
        errors(error.response.data.message[0].constraints.matches, messageApi);
      setIsLoading(false);
      return;
    }
  };

  const handleSubmitUpdate = async (formData: FormData) => {
    try {
      setIsLoading(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/partners/update`,
        formData,
        {
          withCredentials: true,
        },
      );
      await dispatch(updatePartner(res.data));
      setIsLoading(false);
      success('Cập nhật thành công.', messageApi);
      setIsModalVisible(false);
      setIsEdit(false);
      form.resetFields();
    } catch (error: any) {
      if (!Array.isArray(error.response.data.message))
        errors(error.response.data.message, messageApi);
      else
        errors(error.response.data.message[0].constraints.matches, messageApi);
      setIsLoading(false);
      return;
    }
  };

  const handleDeleteRow = async (record: any) => {
    try {
      setIsLoading(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/partners/delete`,
        { id: record.id },
        {
          withCredentials: true,
        },
      );
      await dispatch(deletePartner(record.id));
      setIsLoading(false);
      success('Xóa thành công.', messageApi);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      errors(error.response.data.message, messageApi);
      setIsLoading(false);
      return;
    }
  };

  if (!dataPartners) {
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
            goToWithSearchPartner(
              router,
              searchFilter,
              1,
              Number(value),
              typeFilter,
            );
          }}>
          <Select.Option value="10">10</Select.Option>
          <Select.Option value="20">20</Select.Option>
          <Select.Option value="50">50</Select.Option>
        </Select>
        <Select
          placeholder="Loại đối tác"
          onChange={(value) =>
            goToWithSearchPartner(router, searchFilter, 1, Number(size), value)
          }
          style={{ width: 160 }}
          options={[
            { label: 'Tất cả', value: 'all' },
            { label: 'Khách hàng', value: 'Khách hàng' },
            { label: 'Nhà cung cấp', value: 'Nhà cung cấp' },
          ]}
        />

        <Search
          placeholder="Tìm kiếm đối tác"
          allowClear
          enterButton
          onSearch={(value) =>
            goToWithSearchPartner(router, value, 1, 10, typeFilter)
          }
        />
        <Can I="create" a="partners" ability={ability}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}>
            Thêm mới
          </Button>
        </Can>

        <Modal
          title={`${isEdit ? 'Cập nhật' : 'Thêm mới'}`}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setIsEdit(false);
          }}
          footer={null}
          width={800}>
          <PartnerForm
            onSuccess={() => {
              setIsModalVisible(false);
              setIsEdit(false);
              form.resetFields();
            }}
            handleSubmitCreate={handleSubmitCreate}
            handleEdit={handleSubmitUpdate}
            isEdit={isEdit}
            isLoading={isLoading}
            form={form}
            errors={errors}
            messageApi={messageApi}
          />
        </Modal>

        <Modal
          title={`Thông tin chi tiết đối tác`}
          open={isOpen}
          onCancel={() => {
            setIsOpen(false);
          }}
          footer={null}
          width={400}>
          <Detail data={dataDetail} type="partners" />
        </Modal>
      </Space>

      <Table
        columns={columns}
        dataSource={dataPartners}
        pagination={{
          pageSize: Number(size) || 10,
          current: Number(page) || 1,
          showSizeChanger: false,
          onChange: (page: number, pageSize: number) => {
            const searchFilter = Array.isArray(search)
              ? search[0]
              : search ?? '';
            const sizeFilter = Number(size) || 10;
            goToWithSearchPartner(
              router,
              searchFilter,
              page,
              sizeFilter,
              typeFilter,
            );
          },
        }}
        rowKey="id"
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/partners`,
  );

  return {
    props: {
      data: res.data,
    },
  };
};
