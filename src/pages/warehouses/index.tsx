import React, { useState } from 'react';
import {
  Table,
  Tag,
  Button,
  Input,
  Select,
  Space,
  Dropdown,
  Menu,
  Row,
  Col,
  Card,
} from 'antd';
import {
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import StatusTag from '@/components/status-tag';

const { Option } = Select;
const { Search } = Input;

interface InventoryItem {
  key: string;
  name: string;
  category: string;
  code: string;
  quantity: number;
  location: string;
  status: 'Đang lưu kho' | 'Đã xuất' | 'Hư hỏng';
}

const data: InventoryItem[] = [
  {
    key: '1',
    name: 'iPhone 14 Pro',
    category: 'Điện tử',
    code: 'KHO-001',
    quantity: 150,
    location: 'Kho A1',
    status: 'Đang lưu kho',
  },
  {
    key: '2',
    name: 'Đồng hồ thông minh Apple',
    category: 'Phụ kiện',
    code: 'KHO-002',
    quantity: 72,
    location: 'Kho A2',
    status: 'Đã xuất',
  },
  {
    key: '3',
    name: 'Bàn làm việc gỗ sồi',
    category: 'Nội thất',
    code: 'KHO-003',
    quantity: 20,
    location: 'Kho B1',
    status: 'Hư hỏng',
  },
];

const statusColorMap = {
  'Đang lưu kho': 'blue',
  'Đã xuất': 'green',
  'Hư hỏng': 'red',
};

export default function InventoryPage() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns = [
    {
      title: 'SẢN PHẨM',
      dataIndex: 'name',
      render: (_: any, record: InventoryItem) => (
        <div>
          <strong>{record.name}</strong>
          <div style={{ fontSize: 12, color: '#999' }}>{record.category}</div>
        </div>
      ),
    },
    {
      title: 'MÃ KHO',
      dataIndex: 'code',
    },
    {
      title: 'SỐ LƯỢNG',
      dataIndex: 'quantity',
    },
    {
      title: 'VỊ TRÍ',
      dataIndex: 'location',
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      render: (status: InventoryItem['status']) => (
        // <Tag color={statusColorMap[status]}>{status}</Tag>
        <StatusTag
          status={status}
          colorMap={statusColorMap}
          defaultColor="default"
        />
      ),
    },
    {
      title: 'HÀNH ĐỘNG',
      render: () => (
        <Space>
          <Button icon={<EditOutlined />} />
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1">Xuất hàng</Menu.Item>
                <Menu.Item key="2">Chuyển kho</Menu.Item>
              </Menu>
            }>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Thống kê */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {[
          { label: 'Tổng tồn kho', value: '2.567 sản phẩm' },
          { label: 'Giá trị nhập', value: '45.000 đô la' },
          { label: 'Giá trị đã xuất', value: '18.250 đô la' },
          { label: 'Sản phẩm hư hỏng', value: '5 mục' },
        ].map((item, idx) => (
          <Col span={6} key={idx}>
            <Card>
              <div style={{ fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: 20 }}>{item.value}</div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Bộ lọc */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Select placeholder="Chọn trạng thái" style={{ width: 150 }}>
          <Option value="all">Tất cả</Option>
          <Option value="stored">Đang lưu kho</Option>
          <Option value="exported">Đã xuất</Option>
          <Option value="damaged">Hư hỏng</Option>
        </Select>
        <Select placeholder="Chọn danh mục" style={{ width: 150 }}>
          <Option value="all">Tất cả</Option>
          <Option value="furniture">Nội thất</Option>
          <Option value="electronics">Điện tử</Option>
        </Select>
        <Search placeholder="Tìm kiếm sản phẩm..." allowClear />
        <Select defaultValue="10">
          <Option value="10">10</Option>
          <Option value="20">20</Option>
        </Select>
        <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm kho
        </Button>
      </Space>

      {/* Bảng dữ liệu */}
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        rowKey="key"
      />
    </div>
  );
}
