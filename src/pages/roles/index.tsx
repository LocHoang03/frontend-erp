import React, { useState } from 'react';
import {
  Card,
  Col,
  Row,
  Table,
  Tag,
  Space,
  Button,
  Popconfirm,
  Input,
  Select,
  Modal,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import StatusTag from '@/components/status-tag';
import RoleForm from '@/components/feature-role';

const { Search } = Input;

interface User {
  key: string;
  name: string;
  role: string;
  plan: string;
  payment: string;
  status: 'Hoạt Động' | 'Chưa Gửi Quyết' | 'Không Hoạt Động' | 'Tình Cờ';
}

const usersData: User[] = [
  {
    key: '1',
    name: 'Galen Stichy',
    role: 'Biên Tập Viên',
    plan: 'Doanh Nghiệp',
    payment: 'Tự Động Ghi Nợ',
    status: 'Không Hoạt Động',
  },
  {
    key: '2',
    name: 'Halsey Redmore',
    role: 'Tác Giả',
    plan: 'Đội',
    payment: 'Tự Động Ghi Nợ',
    status: 'Chưa Gửi Quyết',
  },
  {
    key: '3',
    name: 'Murjay Sineky',
    role: 'Người Bảo Trì',
    plan: 'Doanh Nghiệp',
    payment: 'Tự Động Ghi Nợ',
    status: 'Tình Cờ',
  },
  // ... add more rows
];

export default function UserManagementPage() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const columns = [
    {
      title: 'Người Sử Dụng',
      dataIndex: 'name',
    },
    {
      title: 'Vai Trò',
      dataIndex: 'role',
    },
    {
      title: 'Kế Hoạch',
      dataIndex: 'plan',
    },
    {
      title: 'Thanh Toán',
      dataIndex: 'payment',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      render: (status: User['status']) => {
        const colorMap = {
          'Hoạt Động': 'green',
          'Chưa Gửi Quyết': 'orange',
          'Không Hoạt Động': 'default',
          'Tình Cờ': 'blue',
        };
        return (
          <StatusTag
            status={status}
            colorMap={colorMap}
            defaultColor="default"
          />
        );
      },
    },
    {
      title: 'Hành Động',
      render: () => (
        <Space>
          <Button icon={<EditOutlined />} />
          <Popconfirm title="Xác nhận xoá?" onConfirm={() => {}}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button icon={<MoreOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Phần thống kê vai trò */}
      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        {[
          'Người quản lý',
          'Biên tập viên',
          'Người sử dụng',
          'Ủng hộ',
          'Hạn chế',
        ].map((title, i) => (
          <Col key={i} xs={24} sm={12} md={8} lg={6}>
            <Card title={title} extra={`+${i + 3} người`}>
              <div>Chỉnh sửa vai trò</div>
            </Card>
          </Col>
        ))}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setIsModalVisible(true)}>
              Thêm vai trò mới
            </Button>
            <Modal
              title="Thêm vai trò mới"
              open={isModalVisible}
              onCancel={() => setIsModalVisible(false)}
              footer={null}
              width={800} // tùy chỉnh chiều rộng
            >
              <RoleForm onSuccess={() => setIsModalVisible(false)} />
            </Modal>
          </Card>
        </Col>
      </Row>

      {/* Bộ lọc & bảng */}
      <Space style={{ marginBottom: 16 }}>
        <Select defaultValue="Chọn vai trò" style={{ width: 160 }}>
          <Select.Option value="all">Tất cả</Select.Option>
        </Select>
        <Select defaultValue="Chọn kế hoạch" style={{ width: 160 }}>
          <Select.Option value="all">Tất cả</Select.Option>
        </Select>
        <Search placeholder="Tìm kiếm người dùng" />
      </Space>

      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={columns}
        dataSource={usersData}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
