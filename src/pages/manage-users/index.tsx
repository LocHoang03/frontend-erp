import React, { useState } from 'react';
import { Button, Space, Table, Tag, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';

interface Employee {
  key: string;
  name: string;
  email: string;
  address: string;
  phone: string;
}

const initialData: Employee[] = [
  {
    key: '1',
    name: 'Thomas Hardy',
    email: 'ThomasHardy@gmail.com',
    address: '90F Fardingquard Poland, USA.',
    phone: '(79-5823521-0)',
  },
  {
    key: '2',
    name: 'Dominique Perrier',
    email: 'DominiquePerrier@gmail.com',
    address: '90F Serf57, Berlin Poland, Germany.',
    phone: '(79-1234-567)',
  },
  {
    key: '3',
    name: 'Marsal Andrea',
    email: 'MarsalAndrea@gmail.com',
    address: '90F Serf57, Berlin Poland, Germany.',
    phone: '(89-220-666)',
  },
  {
    key: '4',
    name: 'Vishwajeet Design',
    email: 'VishwajeetDesign@gmail.com',
    address: 'B-2 Serf57 Noida East, Delhi, India.',
    phone: '(78-229-084)',
  },
  {
    key: '5',
    name: 'Vishwajeet Kumar',
    email: 'Vishwajeet234@gmail.com',
    address: 'B-2 Serf57 Noida East, Delhi, India.',
    phone: '(79-250-220)',
  },
];

export default function Users() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [data, setData] = useState<Employee[]>(initialData);

  const handleDeleteSelected = () => {
    setData(data.filter((item) => !selectedRowKeys.includes(item.key)));
    setSelectedRowKeys([]);
    message.success('Đã xoá nhân viên đã chọn');
  };

  const handleDeleteRow = (key: string) => {
    setData(data.filter((item) => item.key !== key));
    message.success('Xoá thành công');
  };

  const columns: ColumnsType<Employee> = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Xoá nhân viên?"
            onConfirm={() => handleDeleteRow(record.key)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button type="primary" icon={<EditOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Quản lý tài khoản người dùng</h2>
      <Space style={{ marginBottom: 16 }}>
        <Popconfirm
          title="Xoá các nhân viên đã chọn?"
          onConfirm={handleDeleteSelected}
          disabled={selectedRowKeys.length === 0}>
          <Button danger disabled={selectedRowKeys.length === 0}>
            Xóa
          </Button>
        </Popconfirm>
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm mới
        </Button>
      </Space>
      <Table
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
