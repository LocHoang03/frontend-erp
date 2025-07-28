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
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  Product,
  updateProduct,
} from '@/redux/slice/product';
import { Category } from '@/redux/slice/category';
import ProductForm from '@/components/product-form';
import StatusTag from '@/components/status-tag';
import Image from 'next/image';
import { Warehouse } from '@/redux/slice/warehouse';
import { UserContext } from '@/context/userContext';
import { defineAbilityFor } from '@/casl/ability';
import { Can } from '@/casl/Can';
import Detail from '@/components/detail-data';
import { useRouter } from 'next/router';
import { goToWithSearchProduct } from '@/utils/router-helper';

const { Option } = Select;

const statusColors = {
  'Hoạt động': 'green',
  'Không hoạt động': 'red',
};

export default function ProductsPage({
  data,
  dataCategories,
  dataWarehouses,
}: {
  data: Product[];
  dataCategories: Category[];
  dataWarehouses: Warehouse[];
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [updateId, setupdateId] = useState<number>();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [dataDetail, setDataDetail] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { search, page, size, status, unit } = router.query;
  const searchFilter = Array.isArray(search) ? search[0] : search ?? '';
  const statusFilter = Array.isArray(status) ? status[0] : status ?? '';
  const unitFilter = Array.isArray(unit) ? unit[0] : unit ?? '';

  const [messageApi, contextHolder] = message.useMessage();

  const dataProducts = useAppSelector((state) => state.products.dataRender);

  const { user } = React.useContext(UserContext);

  const ability = useMemo(
    () => defineAbilityFor(user.userRole),
    [user.userRole],
  );

  useEffect(() => {
    dispatch(
      getAllProduct({ data: data, search: search, status: status, unit: unit }),
    );
  }, [dispatch, data, search, status, unit]);

  const handleSubmitCreate = async (dataCreate: any) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/products/create`,
        dataCreate,
        {
          withCredentials: true,
        },
      );
      dispatch(createProduct(res.data));
      setIsLoading(false);
      success('Thêm sản phẩm mới thành công.', messageApi);
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
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/products/update/${updateId}`,
        dataCreate,
        {
          withCredentials: true,
        },
      );
      dispatch(updateProduct(res.data));
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
      setIsLoading(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/products/delete`,
        { id: record.id },
        {
          withCredentials: true,
        },
      );
      dispatch(deleteProduct(record.id));
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
      title: 'Tên danh mục',
      dataIndex: 'name',
      render: (_: any, record: any) => {
        return (
          <span style={{ display: 'flex', alignItems: 'center' }}>
            <Image
              width={35}
              height={35}
              style={{ marginRight: '10px', borderRadius: '50%' }}
              src={record.avatar_url || process.env.NEXT_PUBLIC_IMAGE_PRODUCT}
              alt={`image ${record.name}`}
            />{' '}
            {record.name}
          </span>
        );
      },
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
    },
    {
      title: 'Giá',
      dataIndex: 'unit_price',
      render: (_: any, record: any) => {
        return (
          <span>
            {new Intl.NumberFormat('vi-VN').format(record.unit_price)}
          </span>
        );
      },
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
    },
    {
      title: 'Số lượng',
      dataIndex: 'warehouse_products',
      render: (_: any, record: any) => {
        const totalQuantity = record.warehouse_products?.reduce(
          (sum: number, wp: any) => sum + (wp.quantity || 0),
          0,
        );

        return <span>{totalQuantity || 0}</span>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (_: any, record: any) => {
        return (
          <StatusTag
            status={record.status}
            colorMap={statusColors}
            defaultColor="green"
          />
        );
      },
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
          <Can I="edit" a="products" ability={ability}>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setIsEdit(true);
                setupdateId(record.id);
                form.setFieldsValue({
                  name: record.name,
                  description: record.description,
                  unit_price: record.unit_price,
                  original_price: record.original_price,
                  id: record.id,
                  unit: record.unit,
                  status: record.status,
                  category_id: record.category.id,
                  warehouse_products: record.warehouse_products,
                });
                setIsModalVisible(true);
              }}
            />
          </Can>

          <Can I="delete" a="products" ability={ability}>
            <Popconfirm
              title="Xoá sản phẩm này?"
              onConfirm={() => handleDeleteRow(record)}>
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Can>
        </Space>
      ),
    },
  ];

  if (!dataProducts || !dataWarehouses || !dataCategories) {
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
            goToWithSearchProduct(
              router,
              searchFilter,
              1,
              Number(value),
              statusFilter,
              unitFilter,
            );
          }}>
          <Option value="10">10</Option>
          <Option value="20">20</Option>
          <Option value="50">50</Option>
        </Select>
        <Input.Search
          placeholder="Tìm kiếm sản phẩm"
          allowClear
          enterButton
          onSearch={(value) =>
            goToWithSearchProduct(
              router,
              value,
              1,
              10,
              statusFilter,
              unitFilter,
            )
          }
        />
        <Select
          allowClear
          className="select-option"
          placeholder="Chọn đơn vị"
          style={{ width: 160 }}
          options={[
            { value: 'all', label: 'Tất cả' },
            { value: 'cái', label: 'Cái' },
            { value: 'bộ', label: 'Bộ' },
            { value: 'chiếc', label: 'Chiếc' },
            { value: 'cặp', label: 'Cặp' },
            { value: 'hộp', label: 'Hộp' },
            { value: 'túi', label: 'Túi' },
            { value: 'thùng', label: 'Thùng' },
          ]}
          onChange={(value) =>
            goToWithSearchProduct(
              router,
              searchFilter,
              1,
              Number(size),
              statusFilter,
              value,
            )
          }
        />
        <Select
          allowClear
          className="select-option"
          placeholder="Chọn trạng thái"
          style={{ width: 160 }}
          onChange={(value) =>
            goToWithSearchProduct(
              router,
              searchFilter,
              1,
              Number(size),
              value,
              unitFilter,
            )
          }>
          <Option value="all">Tất cả</Option>
          <Option value="Hoạt động">Hoạt động</Option>
          <Option value="Không hoạt động">Không hoạt động</Option>
        </Select>
        <Can I="create" a="products" ability={ability}>
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
          <ProductForm
            onSuccess={() => {
              setIsModalVisible(false);
              form.resetFields();
              setIsEdit(false);
            }}
            handleSubmitCreate={handleSubmitCreate}
            handleSubmitUpdate={handleSubmitUpdate}
            isEdit={isEdit}
            isLoading={isLoading}
            form={form}
            dataCategories={dataCategories}
            dataWarehouses={dataWarehouses}
          />
        </Modal>{' '}
        <Modal
          title={`Thông tin chi tiết sản phẩm`}
          open={isOpen}
          onCancel={() => {
            setIsOpen(false);
          }}
          footer={null}
          width={600}>
          <Detail data={dataDetail} type="products" />
        </Modal>
      </Space>
      <Table
        columns={columns}
        dataSource={dataProducts}
        pagination={{
          pageSize: Number(size) || 10,
          current: Number(page) || 1,
          showSizeChanger: false,
          onChange: (page: number, pageSize: number) => {
            const searchFilter = Array.isArray(search)
              ? search[0]
              : search ?? '';
            const sizeFilter = Number(size) || 10;
            goToWithSearchProduct(
              router,
              searchFilter,
              page,
              sizeFilter,
              statusFilter,
              unitFilter,
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
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/products`,
  );
  const resCategory = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/categories`,
  );
  const resWarehouse = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/warehouses`,
  );
  return {
    props: {
      data: res.data,
      dataCategories: resCategory.data,
      dataWarehouses: resWarehouse.data,
    },
  };
};
