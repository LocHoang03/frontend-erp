import React from 'react';
import { Table, Button, Tag, Input, Select, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import StatusTag from '@/components/status-tag';

const { Option } = Select;
const { Search } = Input;

interface Project {
  key: string;
  name: string;
  leader: string;
  members: number;
  startDate: string;
  endDate: string;
  status: 'Đang chạy' | 'Hoàn thành' | 'Tạm hoãn';
}

const data: Project[] = [
  {
    key: '1',
    name: 'Website bán hàng',
    leader: 'Nguyễn Văn A',
    members: 5,
    startDate: '01/06/2025',
    endDate: '30/07/2025',
    status: 'Đang chạy',
  },
  {
    key: '2',
    name: 'Ứng dụng di động',
    leader: 'Trần Thị B',
    members: 3,
    startDate: '01/04/2025',
    endDate: '31/05/2025',
    status: 'Hoàn thành',
  },
];

const statusColors = {
  'Đang chạy': 'blue',
  'Hoàn thành': 'green',
  'Tạm hoãn': 'orange',
};

export default function ProjectsPage() {
  const columns = [
    {
      title: 'Tên dự án',
      dataIndex: 'name',
    },
    {
      title: 'Quản lý dự án',
      dataIndex: 'leader',
    },
    {
      title: 'Số thành viên',
      dataIndex: 'members',
    },
    {
      title: 'Bắt đầu',
      dataIndex: 'startDate',
    },
    {
      title: 'Kết thúc',
      dataIndex: 'endDate',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: Project['status']) => (
        // <Tag color={statusColors[status]}>{status}</Tag>
        <StatusTag
          status={status}
          colorMap={statusColors}
          defaultColor="default"
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }} wrap>
        <Select placeholder="Lọc trạng thái" style={{ width: 150 }}>
          <Option value="all">Tất cả</Option>
          <Option value="running">Đang chạy</Option>
          <Option value="done">Hoàn thành</Option>
          <Option value="pause">Tạm hoãn</Option>
        </Select>
        <Search placeholder="Tìm dự án..." allowClear style={{ width: 200 }} />
        <Button type="primary" icon={<PlusOutlined />}>
          Tạo dự án
        </Button>
      </Space>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
    </div>
  );
}
