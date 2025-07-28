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
  CheckCircleOutlined,
} from '@ant-design/icons';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import axios from 'axios';
import { Warehouse } from '@/redux/slice/warehouse';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { errors, success } from '@/components/success-error-info';
import { Product } from '@/redux/slice/product';
import {
  confirmWarehouseTransaction,
  createWarehouseTransaction,
  deleteWarehouseTransaction,
  getAllWarehouseTransaction,
  updateWarehouseTransaction,
  WarehouseTransaction,
} from '@/redux/slice/warehouses-transaction';
import { Partner } from '@/redux/slice/partner';
import WarehouseTransactionForm from '@/components/warehouse-transactions-form';
import { UserContext } from '@/context/userContext';
import { defineAbilityFor } from '@/casl/ability';
import { Can } from '@/casl/Can';
import Detail from '@/components/detail-data';
import { useRouter } from 'next/router';
import { goToWithSearchWarehouseTransaction } from '@/utils/router-helper';
import StatusTag from '@/components/status-tag';

const { Option } = Select;
const { Search } = Input;

const statusColorsWarehouse = {
  'Chưa xử lý': 'orange',
  'Đã xử lý': 'green',
  'Từ chối': 'red',
};

export default function WarehouseTransactionsPage({
  data,
  dataWarehouses,
  dataProducts,
  dataPartners,
}: {
  data: WarehouseTransaction[];
  dataWarehouses: Warehouse[];
  dataProducts: Product[];
  dataPartners: Partner[];
}) {
  const [disabledProduct, setDisabledProduct] = useState<{
    [key: number]: any;
  }>({});
  const [value, setValue] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { search, page, size, status } = router.query;
  const searchFilter = Array.isArray(search) ? search[0] : search ?? '';
  const statusFilter = Array.isArray(status) ? status[0] : status ?? '';

  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const dataWarehouseTransactions = useAppSelector(
    (state) => state.warehouseTransactions.dataRender,
  );

  const { user } = React.useContext(UserContext);

  const ability = useMemo(
    () => defineAbilityFor(user.userRole),
    [user.userRole],
  );

  useEffect(() => {
    dispatch(
      getAllWarehouseTransaction({
        data: data,
        search: search,
        status: status,
      }),
    );
  }, [dispatch, data, search, status]);

  const handleSubmitCreate = async (dataCreate: any) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/warehouse-transactions/create`,
        dataCreate,
        {
          withCredentials: true,
        },
      );
      dispatch(createWarehouseTransaction(res.data));
      setIsLoading(false);
      success('Thêm phiếu mới thành công.', messageApi);
      setIsModalVisible(false);
      form.resetFields();
      setDisabledProduct({});
      setValue('');
      setIsEdit(false);
    } catch (error: any) {
      if (!Array.isArray(error.response.data.message))
        errors(error.response.data.message, messageApi);
      else errors(error.response.data.message[0], messageApi);
      setIsLoading(false);
      return;
    }
  };

  const handleSubmitUpdate = async (dataCreate: any) => {
    try {
      setIsLoading(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/warehouse-transactions/update`,
        dataCreate,
        {
          withCredentials: true,
        },
      );
      dispatch(updateWarehouseTransaction(res.data));
      setIsLoading(false);
      setIsEdit(false);
      success('Cập nhật thành công.', messageApi);
      setIsModalVisible(false);
      form.resetFields();
      setValue('');
      setIsEdit(false);
    } catch (error: any) {
      errors(error.response.data.message, messageApi);
      setIsLoading(false);
      return;
    }
  };
  const handleDeleteRow = async (record: any) => {
    try {
      setIsLoading(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/warehouse-transactions/delete`,
        { id: record.id },
        {
          withCredentials: true,
        },
      );
      dispatch(deleteWarehouseTransaction(record.id));
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

  const handleConfirm = async (record: any) => {
    try {
      setIsLoading(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/warehouse-transactions/confirm`,
        { id: record.id },
        {
          withCredentials: true,
        },
      );
      dispatch(confirmWarehouseTransaction(record.id));
      setIsLoading(false);
      success('Xác nhận thành công.', messageApi);
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
      title: 'Loại phiếu',
      dataIndex: 'type',
    },
    {
      title: 'Kho xuất/nhập',
      dataIndex: 'warehouse',
      render: (_: any, record: any) => {
        return <span>{record.warehouse.name}</span>;
      },
    },
    {
      title: 'Đối tác',
      dataIndex: 'partner',
      render: (_: any, record: any) => {
        return <span>{record.partner.name}</span>;
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'note',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (_: any, record: any) => {
        return (
          <StatusTag
            colorMap={statusColorsWarehouse}
            status={record.status}
            defaultColor="white"
          />
        );
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'created_by',
      render: (_: any, record: any) => {
        return (
          <span>{record.created_by ? record.created_by.full_name : ''}</span>
        );
      },
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
          {record.status == 'Chưa xử lý' && (
            <>
              <Can I="edit" a="warehouse-transactions" ability={ability}>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                    setIsEdit(true);
                    form.setFieldsValue({
                      id: record.id,
                      type: record.type,
                      note: record.note,
                      warehouse_id: record.warehouse.id,
                      partner_id: record.partner.id,
                      warehouse_products: record.items.map((item: any) => ({
                        product_id: item.product.id,
                        quantity: item.quantity,
                      })),
                    });
                    setIsModalVisible(true);
                  }}
                />
              </Can>
              <Can I="edit" a="warehouse-transactions" ability={ability}>
                <Popconfirm
                  title="Xác nhận cho phiếu này?"
                  onConfirm={() => handleConfirm(record)}>
                  <Button icon={<CheckCircleOutlined />} />
                </Popconfirm>
              </Can>
              <Can I="edit" a="warehouse-transactions" ability={ability}>
                <Popconfirm
                  title="Hủy bỏ(từ chối) phiếu này?"
                  onConfirm={() => handleDeleteRow(record)}>
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

      <Space style={{ marginBottom: 16 }} wrap>
        <Search
          placeholder="Tìm kiếm kho hoặc đối tác"
          allowClear
          enterButton
          onSearch={(value) =>
            goToWithSearchWarehouseTransaction(
              router,
              value,
              1,
              10,
              statusFilter,
            )
          }
        />
        <Select
          defaultValue="10"
          onChange={(value) => {
            goToWithSearchWarehouseTransaction(
              router,
              searchFilter,
              1,
              Number(value),
              statusFilter,
            );
          }}>
          <Option value="10">10</Option>
          <Option value="20">20</Option>
        </Select>{' '}
        <Select
          allowClear
          onChange={(value) =>
            goToWithSearchWarehouseTransaction(
              router,
              searchFilter,
              1,
              Number(size),
              value,
            )
          }
          placeholder="Chọn trạng thái"
          options={[
            { value: 'all', label: 'Tất cả' },
            { value: 'Chưa xử lý', label: 'Chưa xử lý' },
            { value: 'Đã xử lý', label: 'Đã xử lý' },
            { value: 'Từ chối', label: 'Từ chối' },
          ]}
        />
        <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
        <Can I="create" a="warehouse-transactions" ability={ability}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}>
            Tạo phiếu
          </Button>
        </Can>
        <Modal
          title={`Thông tin chi tiết nhập/xuất kho`}
          open={isOpen}
          onCancel={() => {
            setIsOpen(false);
          }}
          footer={null}
          width={400}>
          <Detail data={dataDetail} type="warehouse-transactions" />
        </Modal>
        <Modal
          title={`${isEdit ? 'Cập nhật' : 'Thêm mới'}`}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setDisabledProduct({});
            setValue('');
            setIsEdit(false);
          }}
          footer={null}
          width={800}>
          <WarehouseTransactionForm
            onSuccess={() => {
              setIsModalVisible(false);
              setIsEdit(false);
              form.resetFields();
              setValue('');
              setDisabledProduct({});
            }}
            handleSubmitCreate={handleSubmitCreate}
            handleSubmitUpdate={handleSubmitUpdate}
            isEdit={isEdit}
            isLoading={isLoading}
            form={form}
            dataWarehouses={dataWarehouses}
            dataProducts={dataProducts}
            disabledProduct={disabledProduct}
            setDisabledProduct={setDisabledProduct}
            dataPartner={dataPartners}
            value={value}
            setValue={setValue}
          />
        </Modal>
      </Space>

      <Table
        columns={columns}
        dataSource={dataWarehouseTransactions}
        pagination={{
          pageSize: Number(size) || 10,
          current: Number(page) || 1,
          showSizeChanger: false,
          onChange: (page: number, pageSize: number) => {
            const searchFilter = Array.isArray(search)
              ? search[0]
              : search ?? '';
            const sizeFilter = Number(size) || 10;
            goToWithSearchWarehouseTransaction(
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
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/warehouse-transactions`,
  );
  const resWarehouses = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/warehouses`,
  );
  const resProducts = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/products`,
  );
  const resPartners = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/partners`,
  );
  return {
    props: {
      data: res.data,
      dataWarehouses: resWarehouses.data,
      dataProducts: resProducts.data,
      dataPartners: resPartners.data,
    },
  };
};
