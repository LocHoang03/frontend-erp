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
import WarehouseTransferForm from '@/components/warehouse-transfers-form';
import {
  confirmWarehouseTransfer,
  createWarehouseTransfer,
  deleteWarehouseTransfer,
  getAllWarehouseTransfer,
  updateWarehouseTransfer,
  WarehouseTransfer,
} from '@/redux/slice/warehouses-transfers';
import { Product } from '@/redux/slice/product';
import { UserContext } from '@/context/userContext';
import { defineAbilityFor } from '@/casl/ability';
import { Can } from '@/casl/Can';
import Detail from '@/components/detail-data';
import { useRouter } from 'next/router';
import { goToWithSearchWarehouseTransfer } from '@/utils/router-helper';

const { Option } = Select;
const { Search } = Input;

export default function WarehouseTransferPage({
  data,
  dataWarehouses,
  dataProducts,
}: {
  data: WarehouseTransfer[];
  dataWarehouses: Warehouse[];
  dataProducts: Product[];
}) {
  const [disabled, setDisabled] = useState<{ [key: number]: any }>({});
  const [disabledProduct, setDisabledProduct] = useState<{
    [key: number]: any;
  }>({});
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

  const dataWarehouseTransfers = useAppSelector(
    (state) => state.warehouseTransfers.dataRender,
  );

  const { user } = React.useContext(UserContext);

  const ability = useMemo(
    () => defineAbilityFor(user.userRole),
    [user.userRole],
  );

  useEffect(() => {
    dispatch(
      getAllWarehouseTransfer({ data: data, search: search, status: status }),
    );
  }, [dispatch, data, search, status]);

  const handleSubmitCreate = async (dataCreate: any) => {
    console.log(dataCreate);
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/warehouse-transfers/create`,
        dataCreate,
        {
          withCredentials: true,
        },
      );
      dispatch(createWarehouseTransfer(res.data));
      setIsLoading(false);
      success('Thêm phiếu mới thành công.', messageApi);
      setIsModalVisible(false);
      form.resetFields();
      setDisabled({});
      setDisabledProduct({});
      setIsEdit(false);
    } catch (error: any) {
      console.log(error);
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
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/warehouse-transfers/update`,
        dataCreate,
        {
          withCredentials: true,
        },
      );
      dispatch(updateWarehouseTransfer(res.data));
      setIsLoading(false);
      setIsEdit(false);
      success('Cập nhật thành công.', messageApi);
      setIsModalVisible(false);
      form.resetFields();
      setIsEdit(false);
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
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/warehouse-transfers/delete`,
        { id: record.id },
        {
          withCredentials: true,
        },
      );
      dispatch(deleteWarehouseTransfer(record.id));
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
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/warehouse-transfers/confirm`,
        { id: record.id },
        {
          withCredentials: true,
        },
      );
      dispatch(confirmWarehouseTransfer(record.id));
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
      title: 'Kho xuất',
      dataIndex: 'from_warehouse',
      render: (_: any, record: any) => {
        return (
          <span>{record.from_warehouse ? record.from_warehouse.name : ''}</span>
        );
      },
    },
    {
      title: 'Kho nhập',
      dataIndex: 'to_warehouse',
      render: (_: any, record: any) => {
        return (
          <span>{record.to_warehouse ? record.to_warehouse.name : ''}</span>
        );
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'note',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
    },
    {
      title: 'Người tạo',
      dataIndex: 'created_by',
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
          {record.status == 'Chưa xác nhận' && (
            <>
              <Can I="edit" a="warehouses-transfers" ability={ability}>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                    setIsEdit(true);
                    console.log(record);
                    form.setFieldsValue({
                      id: record.id,
                      note: record.note,
                      from_warehouse_id: record.from_warehouse.id,
                      to_warehouse_id: record.to_warehouse.id,
                      warehouse_products: record.items.map((item: any) => ({
                        product_id: item.product.id,
                        quantity: item.quantity,
                      })),
                    });
                    setIsModalVisible(true);
                  }}
                />
              </Can>
              <Can I="edit" a="warehouses-transfers" ability={ability}>
                <Popconfirm
                  title="Xác nhận cho phiếu này?"
                  onConfirm={() => handleConfirm(record)}>
                  <Button icon={<CheckCircleOutlined />} />
                </Popconfirm>
              </Can>

              <Can I="edit" a="warehouses-transfers" ability={ability}>
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
          placeholder="Tìm kho nhập/xuất"
          allowClear
          enterButton
          onSearch={(value) =>
            goToWithSearchWarehouseTransfer(router, value, 1, 10, statusFilter)
          }
        />
        <Select
          allowClear
          onChange={(value) =>
            goToWithSearchWarehouseTransfer(
              router,
              searchFilter,
              1,
              Number(size),
              value,
            )
          }
          className="select-option"
          placeholder="Chọn trạng thái"
          style={{ width: 160 }}>
          <Option value="all">Tất cả</Option>
          <Option value="Chưa xác nhận">Chưa xác nhận</Option>
          <Option value="Hoàn tất">Hoàn tất</Option>
          <Option value="Từ chối">Từ chối</Option>
        </Select>

        <Select
          defaultValue="10"
          onChange={(value) => {
            goToWithSearchWarehouseTransfer(
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
        <Button icon={<DownloadOutlined />}>Xuất Excel</Button>

        <Can I="create" a="warehouses-transfers" ability={ability}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}>
            Tạo phiếu
          </Button>
        </Can>

        <Modal
          title={`Thông tin chi tiết chuyển kho`}
          open={isOpen}
          onCancel={() => {
            setIsOpen(false);
          }}
          footer={null}
          width={400}>
          <Detail data={dataDetail} type="warehouse-transfers" />
        </Modal>

        <Modal
          title={`${isEdit ? 'Cập nhật' : 'Thêm mới'}`}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setDisabled({});
            setDisabledProduct({});
            setIsEdit(false);
          }}
          footer={null}
          width={800}>
          <WarehouseTransferForm
            onSuccess={() => {
              setIsModalVisible(false);
              setIsEdit(false);
              form.resetFields();
              setDisabled({});
              setDisabledProduct({});
            }}
            handleSubmitCreate={handleSubmitCreate}
            handleSubmitUpdate={handleSubmitUpdate}
            isEdit={isEdit}
            isLoading={isLoading}
            form={form}
            dataWarehouses={dataWarehouses}
            dataProducts={dataProducts}
            disabled={disabled}
            disabledProduct={disabledProduct}
            setDisabled={setDisabled}
            setDisabledProduct={setDisabledProduct}
          />
        </Modal>
      </Space>

      <Table
        columns={columns}
        dataSource={dataWarehouseTransfers}
        pagination={{
          pageSize: Number(size) || 10,
          current: Number(page) || 1,
          showSizeChanger: false,
          onChange: (page: number, pageSize: number) => {
            const searchFilter = Array.isArray(search)
              ? search[0]
              : search ?? '';
            const sizeFilter = Number(size) || 10;
            goToWithSearchWarehouseTransfer(
              router,
              searchFilter,
              page,
              Number(sizeFilter),
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
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/warehouse-transfers`,
  );
  const resWarehouses = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/warehouses`,
  );
  const resProducts = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/products`,
  );
  return {
    props: {
      data: res.data,
      dataWarehouses: resWarehouses.data,
      dataProducts: resProducts.data,
    },
  };
};
