import React, { useState } from 'react';
import { Table, Button, Input, Select, Space, Tag, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import StatusTag from '@/components/status-tag';

const { Search } = Input;
const { Option } = Select;

interface Employee {
  key: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: 'Đang làm' | 'Nghỉ phép' | 'Đã nghỉ';
}

const initialEmployees: Employee[] = [
  {
    key: '1',
    name: 'Nguyễn Văn A',
    position: 'Kỹ sư phần mềm',
    department: 'CNTT',
    email: 'nguyenvana@company.com',
    phone: '0901 234 567',
    status: 'Đang làm',
  },
  {
    key: '2',
    name: 'Trần Thị B',
    position: 'Kế toán trưởng',
    department: 'Tài chính',
    email: 'tranthib@company.com',
    phone: '0902 345 678',
    status: 'Nghỉ phép',
  },
  {
    key: '3',
    name: 'Lê Văn C',
    position: 'Quản lý nhân sự',
    department: 'Nhân sự',
    email: 'levanc@company.com',
    phone: '0903 456 789',
    status: 'Đã nghỉ',
  },
];

const statusColors = {
  'Thử việc': 'blue',
  'Đang làm': 'green',
  'Nghỉ phép': 'orange',
  'Tạm nghỉ': 'gold',
  'Đã nghỉ': 'red',
};

export default function EmployeePage() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState<Employee[]>(initialEmployees);

  const handleDelete = (key: string) => {
    setData(data.filter((item) => item.key !== key));
  };

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'name',
    },
    {
      title: 'Chức vụ',
      dataIndex: 'position',
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'SĐT',
      dataIndex: 'phone',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: Employee['status']) => (
        // <Tag color={statusColors[status]}>{status}</Tag>
        <StatusTag
          status={status}
          colorMap={statusColors}
          defaultColor="default"
        />
      ),
    },
    {
      title: 'Hành động',
      render: (_: any, record: Employee) => (
        <Space>
          <Button icon={<EditOutlined />} />
          <Popconfirm
            title="Xoá nhân sự này?"
            onConfirm={() => handleDelete(record.key)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }} wrap>
        <Select placeholder="Chọn phòng ban" style={{ width: 160 }}>
          <Option value="all">Tất cả</Option>
          <Option value="cntt">CNTT</Option>
          <Option value="taichinh">Tài chính</Option>
          <Option value="nhansu">Nhân sự</Option>
        </Select>
        <Select placeholder="Chọn trạng thái" style={{ width: 160 }}>
          <Option value="all">Tất cả</Option>
          <Option value="danglam">Đang làm</Option>
          <Option value="nghiphep">Nghỉ phép</Option>
          <Option value="danghi">Đã nghỉ</Option>
        </Select>
        <Search placeholder="Tìm kiếm nhân sự" allowClear />
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm nhân sự
        </Button>
      </Space>

      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        rowKey="key"
      />
    </div>
  );
}
