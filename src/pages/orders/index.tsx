import React from 'react';
import {
  Table,
  Tag,
  Button,
  Input,
  Space,
  Select,
  Avatar,
  Dropdown,
  Menu,
} from 'antd';
import { DownloadOutlined, MoreOutlined } from '@ant-design/icons';
import StatusTag from '@/components/status-tag';

const { Option } = Select;

interface Order {
  key: string;
  orderId: string;
  date: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  payment: 'Paid' | 'Failed' | 'Cancelled' | 'Pending';
  status: 'Đã giao' | 'Sẵn sàng lấy' | 'Đang giao' | 'Đã gửi đi';

  method: string;
}

const paymentColors = {
  Paid: 'green',
  Failed: 'red',
  Cancelled: 'default',
  Pending: 'orange',
};

const statusColors = {
  'Đã giao': 'green',
  'Sẵn sàng lấy': 'cyan',
  'Đang giao': 'purple',
  'Đã gửi đi': 'orange',
};

const data: Order[] = [
  {
    key: '1',
    orderId: '#5434',
    date: 'Thứ Hai, 16/05/2022, 2:11 sáng',
    customer: {
      name: 'Gabrielle Feyer',
      email: 'gfeyer@onyu.edu',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    payment: 'Paid',
    status: 'Đã giao',
    method: 'PayPal',
  },
  {
    key: '2',
    orderId: '#6745',
    date: 'Thứ Tư, 03/05/2023, 7:26 tối',
    customer: {
      name: 'Jackson Deignan',
      email: 'jdeignan@dell.com',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    payment: 'Cancelled',
    status: 'Đã giao',
    method: 'PayPal',
  },
  {
    key: '3',
    orderId: '#6087',
    date: 'Thứ Năm, 15/12/2022, 6:51 tối',
    customer: {
      name: 'Tanya Crum',
      email: 'tcrum2@nyandex.ru',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    payment: 'Failed',
    status: 'Sẵn sàng lấy',
    method: 'Visa',
  },
];

export default function OrdersPage() {
  const columns = [
    {
      title: 'MÃ ĐƠN',
      dataIndex: 'orderId',
      render: (text: string) => <a style={{ color: '#1677ff' }}>{text}</a>,
    },
    {
      title: 'NGÀY ĐẶT',
      dataIndex: 'date',
    },
    {
      title: 'KHÁCH HÀNG',
      dataIndex: 'customer',
      render: (customer: Order['customer']) => (
        <Space>
          <Avatar src={customer.avatar} />
          <div>
            <div>{customer.name}</div>
            <div style={{ color: '#999', fontSize: 12 }}>{customer.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'THANH TOÁN',
      dataIndex: 'payment',
      render: (payment: Order['payment']) => (
        <span>
          <span style={{ color: paymentColors[payment], marginRight: 8 }}>
            ●
          </span>
          {
            {
              Paid: 'Đã thanh toán',
              Failed: 'Thất bại',
              Cancelled: 'Đã hủy',
              Pending: 'Đang chờ',
            }[payment]
          }
        </span>
      ),
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      render: (status: Order['status']) => (
        <StatusTag
          status={status}
          colorMap={statusColors}
          defaultColor="default"
        />
      ),
    },
    {
      title: 'PHƯƠNG THỨC',
      dataIndex: 'method',
      render: (text: string) => <span>💳 {text}</span>,
    },
    {
      title: 'THAO TÁC',
      render: () => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="1">Xem chi tiết</Menu.Item>
              <Menu.Item key="2">Hủy đơn</Menu.Item>
            </Menu>
          }>
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
        <div>
          <h3>56</h3>
          <div>Đang chờ thanh toán</div>
        </div>
        <div>
          <h3>12,689</h3>
          <div>Đã hoàn thành</div>
        </div>
        <div>
          <h3>124</h3>
          <div>Đã hoàn tiền</div>
        </div>
        <div>
          <h3>32</h3>
          <div>Thất bại</div>
        </div>
      </div>

      <Space style={{ marginBottom: 16 }} wrap>
        <Input.Search
          placeholder="Tìm kiếm đơn hàng"
          style={{ width: 200 }}
          allowClear
        />
        <Select defaultValue="10">
          <Option value="10">Hiển thị 10</Option>
          <Option value="20">Hiển thị 20</Option>
        </Select>
        <Button icon={<DownloadOutlined />}>Xuất file</Button>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        rowSelection={{}}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
