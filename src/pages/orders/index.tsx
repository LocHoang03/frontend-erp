import React, { useEffect, useState } from 'react';
import { Table, Input, Space, Select, Button, Modal } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import axios from 'axios';
import { getAllOrder, Order } from '@/redux/slice/order';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { goToWithSearchOrder } from '@/utils/router-helper';
import { ColumnsType } from 'antd/es/table';
import StatusTag from '@/components/status-tag';
import Detail from '@/components/detail-data';

const { Option } = Select;

const statusColorsStatus = {
  'Chờ thanh toán': 'orange',
  'Đã thanh toán': 'green',
  'Đã hủy': 'red',
};

const statusColorsType = {
  'Chưa xác định': 'gray',
  'Tiền mặt': 'blue',
  'Chuyển khoản ngân hàng': 'purple',
  'Ví điện tử': 'cyan',
};

export default function OrdersPage({ data }: { data: Order[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dataDetail, setDataDetail] = useState({});

  const router = useRouter();
  const { search, page, size, status, type } = router.query;
  const searchFilter = Array.isArray(search) ? search[0] : search ?? '';
  const statusFilter = Array.isArray(status) ? status[0] : status ?? '';
  const typeFilter = Array.isArray(type) ? type[0] : type ?? '';

  const dataOrder = useAppSelector((state) => state.orders.dataRender);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(
      getAllOrder({
        data: data,
        search: searchFilter,
        type: typeFilter,
        status: statusFilter,
      }),
    );
  }, [dispatch, data, searchFilter, typeFilter, statusFilter]);

  const columns: ColumnsType<Order> = [
    {
      title: 'Họ tên khách hàng',
      dataIndex: 'full_name',
      render: (_, record) => <span>{record.customer?.full_name}</span>,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      render: (_, record) => (
        <span>
          {record.customer?.phone ? record.customer?.phone : 'Chưa cập nhật'}
        </span>
      ),
    },
    {
      title: 'Tổng tiền hóa đơn',
      dataIndex: 'total_amount',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (_, record) => (
        <StatusTag
          status={record.status}
          colorMap={statusColorsStatus}
          defaultColor="white"
        />
      ),
    },
    {
      title: 'Phương thức',
      dataIndex: 'payment_method',
      render: (_, record) => (
        <StatusTag
          status={record.payment_method}
          colorMap={statusColorsType}
          defaultColor="white"
        />
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
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }} wrap>
        <span>Trình diễn</span>
        <Select
          defaultValue="10"
          onChange={(value) => {
            goToWithSearchOrder(
              router,
              searchFilter,
              1,
              Number(value),
              statusFilter,
              typeFilter,
            );
          }}>
          <Select.Option value="10">10</Select.Option>
          <Select.Option value="20">20</Select.Option>
          <Select.Option value="50">50</Select.Option>
        </Select>
        <Input.Search
          placeholder="Tên hoặc số điện thoại"
          allowClear
          enterButton
          onSearch={(value) =>
            goToWithSearchOrder(router, value, 1, 10, statusFilter, typeFilter)
          }
        />

        <Select
          allowClear
          className="select-option"
          placeholder="Chọn trạng thái"
          style={{ width: 160 }}
          onChange={(value) =>
            goToWithSearchOrder(
              router,
              searchFilter,
              1,
              Number(size),
              value,
              typeFilter,
            )
          }>
          <Option value="all">Tất cả</Option>
          <Option value="Chờ thanh toán">Chờ thanh toán</Option>
          <Option value="Đã thanh toán">Đã thanh toán</Option>
          <Option value="Đã hủy">Đã hủy</Option>
        </Select>

        <Select
          allowClear
          className="select-option"
          placeholder="Chọn phương thức"
          style={{ width: 160 }}
          onChange={(value) =>
            goToWithSearchOrder(
              router,
              searchFilter,
              1,
              Number(size),
              statusFilter,
              value,
            )
          }>
          <Option value="all">Tất cả</Option>
          <Option value="Chưa xác định">Chưa xác định</Option>
          <Option value="Tiền mặt">Tiền mặt</Option>
          <Option value="Chuyển khoản ngân hàng">Chuyển khoản ngân hàng</Option>
          <Option value="Ví điện tử">Ví điện tử</Option>
        </Select>

        <Modal
          title={`Thông tin chi tiết đơn hàng`}
          open={isOpen}
          onCancel={() => {
            setIsOpen(false);
          }}
          footer={null}
          width={600}>
          <Detail data={dataDetail} type="orders" />
        </Modal>
      </Space>

      <Table
        columns={columns}
        dataSource={dataOrder}
        pagination={{
          pageSize: Number(size) || 10,
          current: Number(page) || 1,
          showSizeChanger: false,
          onChange: (page: number, pageSize: number) => {
            const searchFilter = Array.isArray(search)
              ? search[0]
              : search ?? '';
            const sizeFilter = Number(size) || 10;
            goToWithSearchOrder(
              router,
              searchFilter,
              page,
              Number(sizeFilter),
              statusFilter,
              typeFilter,
            );
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
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/orders`,
  );

  return {
    props: {
      data: res.data,
    },
  };
};
