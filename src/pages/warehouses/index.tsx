import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Form,
  message,
  Modal,
  Popconfirm,
} from 'antd';
import {
  EditOutlined,
  PlusOutlined,
  DownloadOutlined,
  EyeOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import axios from 'axios';
import {
  createWarehouse,
  deleteWarehouse,
  getAllWarehouse,
  updateWarehouse,
  Warehouse,
} from '@/redux/slice/warehouse';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { errors, success } from '@/components/success-error-info';
import WarehouseForm from '@/components/warehouse-form';
import { defineAbilityFor } from '@/casl/ability';
import { UserContext } from '@/context/userContext';
import { Can } from '@/casl/Can';
import Detail from '@/components/detail-data';
import { useRouter } from 'next/router';
import { goToWithSearch } from '@/utils/router-helper';

const { Option } = Select;
const { Search } = Input;

export default function InventoryPage({ data }: { data: Warehouse[] }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { search, page, size } = router.query;

  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const dataWarehouses = useAppSelector((state) => state.warehouses.dataRender);

  const { user } = React.useContext(UserContext);

  const ability = useMemo(
    () => defineAbilityFor(user.userRole),
    [user.userRole],
  );

  useEffect(() => {
    dispatch(getAllWarehouse({ data: data, search: search }));
  }, [dispatch, data, search]);

  const handleSubmitCreate = async (dataCreate: any) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/warehouses/create`,
        dataCreate,
        {
          withCredentials: true,
        },
      );
      dispatch(createWarehouse(res.data));
      setIsLoading(false);
      success('Thêm kho mới thành công.', messageApi);
      setIsModalVisible(false);
      form.resetFields();
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
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/warehouses/update`,
        dataCreate,
        {
          withCredentials: true,
        },
      );
      dispatch(updateWarehouse(res.data));
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
  const handleDeleteRow = async (record: any) => {
    try {
      console.log(record);
      setIsLoading(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/warehouses/delete`,
        { id: record.id },
        {
          withCredentials: true,
        },
      );
      dispatch(deleteWarehouse(record.id));
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

  const columns = [
    {
      title: 'Tên kho',
      dataIndex: 'name',
    },
    {
      title: 'Vị trí',
      dataIndex: 'location',
    },
    {
      title: 'Hành động',
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setDataDetail(record);
              setIsOpen(true);
            }}
          />
          <Can I="edit" a="warehouses" ability={ability}>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setIsEdit(true);
                form.setFieldsValue({
                  id: record.id,
                  name: record.name,
                  location: record.location,
                });
                setIsModalVisible(true);
              }}
            />
          </Can>
          <Can I="edit" a="warehouses" ability={ability}>
            <Popconfirm
              title="Xoá kho này?"
              onConfirm={() => handleDeleteRow(record)}>
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Can>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}

      <Space style={{ marginBottom: 16 }} wrap>
        <Search
          placeholder="Tìm kiếm kho hoặc vị trí"
          allowClear
          enterButton
          onSearch={(value) => goToWithSearch(router, value, 1, 10)}
        />
        <Select
          defaultValue="10"
          onChange={(value) => {
            const searchFilter = Array.isArray(search)
              ? search[0]
              : search ?? '';
            goToWithSearch(router, searchFilter, 1, Number(value));
          }}>
          <Option value="10">10</Option>
          <Option value="20">20</Option>
          <Option value="50">50</Option>
        </Select>
        <Button icon={<DownloadOutlined />}>Xuất Excel</Button>

        <Can I="create" a="warehouses" ability={ability}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}>
            Thêm kho
          </Button>
        </Can>

        <Modal
          title={`Thông tin chi tiết kho`}
          open={isOpen}
          onCancel={() => {
            setIsOpen(false);
          }}
          footer={null}
          width={400}>
          <Detail data={dataDetail} type="warehouses" />
        </Modal>

        <Modal
          title={`${isEdit ? 'Cập nhật' : 'Thêm mới'}`}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={800}>
          <WarehouseForm
            onSuccess={() => {
              setIsModalVisible(false);
              setIsEdit(false);
              form.resetFields();
            }}
            handleSubmitCreate={handleSubmitCreate}
            handleSubmitUpdate={handleSubmitUpdate}
            isEdit={isEdit}
            isLoading={isLoading}
            form={form}
          />
        </Modal>
      </Space>

      <Table
        columns={columns}
        dataSource={dataWarehouses}
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
        rowKey="key"
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/warehouses`,
  );

  return {
    props: {
      data: res.data,
    },
  };
};
