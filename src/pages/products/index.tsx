import React, { useState } from 'react';
import {
  Table,
  Tag,
  Button,
  Input,
  Select,
  Space,
  Switch,
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

interface Product {
  key: string;
  name: string;
  type: string;
  description: string;
  hasPart: boolean;
  code: string;
  price: string;
  quantity: number;
  status: 'Xuất bản' | 'Đã lên lịch' | 'Không hoạt động';
}

const data: Product[] = [
  {
    key: '1',
    name: 'iPhone 14 Pro',
    description: 'Màn hình Super Retina XDR...',
    type: 'Điện tử',
    hasPart: true,
    code: '19472',
    price: '999 đô la',
    quantity: 665,
    status: 'Không hoạt động',
  },
  {
    key: '2',
    name: 'Echo Dot (Thế hệ thứ 4)',
    description: 'Loa thông minh với Alexa',
    type: 'Điện tử',
    hasPart: true,
    code: '72836',
    price: '25,50 đô la',
    quantity: 827,
    status: 'Xuất bản',
  },
  {
    key: '3',
    name: 'Đồng hồ treo tường Dohioe',
    description: 'Đồng hồ decor treo tường hiện đại',
    type: 'Phụ kiện',
    hasPart: false,
    code: '29540',
    price: '16,34 đô la',
    quantity: 804,
    status: 'Xuất bản',
  },
  {
    key: '4',
    name: 'Giày chạy bộ INZCOU',
    description: 'Giày tennis nhẹ chống trượt',
    type: 'Đôi giày',
    hasPart: false,
    code: '49402',
    price: '36,98 đô la',
    quantity: 528,
    status: 'Đã lên lịch',
  },
  // ... thêm các sản phẩm còn lại theo ảnh
];

const statusColors = {
  'Xuất bản': 'green',
  'Đã lên lịch': 'orange',
  'Không hoạt động': 'red',
};

export default function ProductPage() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const columns = [
    {
      title: 'SẢN PHẨM',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: Product) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.name}</div>
          <div style={{ fontSize: 12, color: '#999' }}>
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: 'LOẠI',
      dataIndex: 'type',
    },
    {
      title: 'CÓ PHẦN',
      dataIndex: 'hasPart',
      render: (val: boolean) => <Switch checked={val} />,
    },
    {
      title: 'MÃ SẢN PHẨM',
      dataIndex: 'code',
    },
    {
      title: 'GIÁ',
      dataIndex: 'price',
    },
    {
      title: 'SỐ LƯỢNG',
      dataIndex: 'quantity',
    },
    {
      title: 'TRẠNG THÁI',
      dataIndex: 'status',
      render: (status: Product['status']) => (
        // <Tag color={statusColors[status]}>{status}</Tag>
        <StatusTag
          status={status}
          colorMap={statusColors}
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
                <Menu.Item key="1">Ẩn sản phẩm</Menu.Item>
                <Menu.Item key="2">Sao chép</Menu.Item>
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
      {/* Bảng thống kê */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {[
          {
            label: 'Bán hàng tại cửa hàng',
            value: '5.345 đô la',
            sub: '5k đơn hàng',
            change: '+5.7%',
          },
          {
            label: 'Bán hàng trên trang web',
            value: '74.347 đô la',
            sub: '21k đơn hàng',
            change: '+12.4%',
          },
          { label: 'Giảm giá', value: '14.235 đô la', sub: '6k đơn hàng' },
          {
            label: 'Liên kết',
            value: '8.345 đô la',
            sub: '150 đơn hàng',
            change: '-3.5%',
          },
        ].map((item, idx) => (
          <Col span={6} key={idx}>
            <Card>
              <div style={{ fontWeight: 600 }}>{item.label}</div>
              <div style={{ fontSize: 20 }}>{item.value}</div>
              <div style={{ color: '#999', fontSize: 12 }}>
                {item.sub}{' '}
                {item.change && (
                  <span
                    style={{
                      color: item.change.includes('+') ? 'green' : 'red',
                    }}>
                    ({item.change})
                  </span>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Bộ lọc */}
      <Space wrap style={{ marginBottom: 16 }}>
        <Select placeholder="Chọn trạng thái" style={{ width: 150 }}>
          <Option value="all">Tất cả</Option>
          <Option value="published">Xuất bản</Option>
        </Select>
        <Select placeholder="Chọn danh mục" style={{ width: 150 }}>
          <Option value="all">Tất cả</Option>
        </Select>
        <Select placeholder="Chọn có phiếu" style={{ width: 150 }}>
          <Option value="yes">Có</Option>
          <Option value="no">Không</Option>
        </Select>
        <Search placeholder="Tìm kiếm sản phẩm" allowClear />
        <Select defaultValue="10">
          <Option value="10">10</Option>
          <Option value="20">20</Option>
        </Select>
        <Button icon={<DownloadOutlined />}>Xuất khẩu</Button>
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm sản phẩm
        </Button>
      </Space>

      {/* Bảng sản phẩm */}
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
