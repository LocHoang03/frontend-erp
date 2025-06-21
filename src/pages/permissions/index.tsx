import React from 'react';
import { Table, Tag, Button, Input, Select, Space, Dropdown, Menu } from 'antd';
import { PlusOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import StatusTag from '@/components/status-tag';

const { Option } = Select;

interface Permission {
  key: string;
  name: string;
  roles: string[];
  createdAt: string;
}

const data: Permission[] = [
  {
    key: '1',
    name: 'Sự quản lý',
    roles: ['Người Quản Lý'],
    createdAt: '14 tháng 4 năm 2021, 8:43 tối',
  },
  {
    key: '2',
    name: 'Quản lý thanh toán và vai trò',
    roles: ['Người Quản Lý'],
    createdAt: '16 tháng 9 năm 2021, 5:20 chiều',
  },
  {
    key: '3',
    name: 'Thêm & Xóa Người dùng',
    roles: ['Người Quản Lý', 'Giám Đốc'],
    createdAt: '14 tháng 10 năm 2021, 10:20 sáng',
  },
  {
    key: '4',
    name: 'Lập kế hoạch dự án',
    roles: ['Người Quản Lý', 'Người Sử Dụng', 'Ủng Hộ'],
    createdAt: '14 tháng 10 năm 2021, 10:20 sáng',
  },
  {
    key: '5',
    name: 'Quản lý chuỗi email',
    roles: ['Người Quản Lý', 'Người Sử Dụng', 'Ủng Hộ'],
    createdAt: '23 tháng 8 năm 2021, 2:00 chiều',
  },
  {
    key: '6',
    name: 'Giao tiếp với khách hàng',
    roles: ['Người Quản Lý', 'Giám Đốc'],
    createdAt: '15 tháng 4 năm 2021, 11:30 sáng',
  },
  {
    key: '7',
    name: 'Chỉ xem',
    roles: ['Người Quản Lý', 'Người Dùng Bị Hạn Chế'],
    createdAt: '04 tháng 12 năm 2021, 8:15 PM',
  },
];

const roleColorMap: Record<string, string> = {
  'Người Quản Lý': 'purple',
  'Giám Đốc': 'orange',
  'Người Sử Dụng': 'green',
  'Ủng Hộ': 'cyan',
  'Người Dùng Bị Hạn Chế': 'red',
};

export default function PermissionsPage() {
  const columns = [
    {
      title: 'TÊN',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ĐƯỢC GIAO CHO',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => (
        <Space size={[4, 4]} wrap>
          {roles.map((role) => (
            <StatusTag
              key={role}
              status={role}
              colorMap={roleColorMap}
              defaultColor="blue"
            />
            // <Tag key={role} color={roleColorMap[role] || 'blue'}>
            //   {role}
            // </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'NGÀY TẠO',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'HÀNH ĐỘNG',
      key: 'actions',
      render: () => (
        <Space>
          <Button icon={<EditOutlined />} />
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1">Sao chép</Menu.Item>
                <Menu.Item key="2">Ẩn quyền</Menu.Item>
              </Menu>
            }
            trigger={['click']}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }} wrap>
        <span>Trình diễn</span>
        <Select defaultValue="7">
          <Option value="7">7</Option>
          <Option value="10">10</Option>
        </Select>
        <Input.Search placeholder="Quyền tìm kiếm" />
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm Quyền
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 7 }}
        rowKey="key"
      />
    </div>
  );
}
