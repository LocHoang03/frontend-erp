import React from 'react';
import { Table, Tag, Button, Select, Input, Space, DatePicker } from 'antd';
import { CheckOutlined, PlusOutlined } from '@ant-design/icons';
import StatusTag from '@/components/status-tag';

const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

interface Task {
  key: string;
  name: string;
  assignee: string;
  project: string;
  deadline: string;
  priority: 'Thấp' | 'Trung bình' | 'Cao';
  status: 'Chưa làm' | 'Đang làm' | 'Đã xong';
}

const data: Task[] = [
  {
    key: '1',
    name: 'Thiết kế trang chủ',
    assignee: 'Lê Văn C',
    project: 'Website bán hàng',
    deadline: '25/06/2025',
    priority: 'Cao',
    status: 'Đang làm',
  },
  {
    key: '2',
    name: 'Viết API sản phẩm',
    assignee: 'Nguyễn Văn A',
    project: 'Website bán hàng',
    deadline: '22/06/2025',
    priority: 'Trung bình',
    status: 'Chưa làm',
  },
];

const statusColors = {
  'Chưa làm': 'default',
  'Đang làm': 'orange',
  'Đã xong': 'green',
};

const priorityColors = {
  Thấp: 'blue',
  'Trung bình': 'gold',
  Cao: 'red',
};

export default function TasksPage() {
  const columns = [
    {
      title: 'Tên công việc',
      dataIndex: 'name',
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'assignee',
    },
    {
      title: 'Thuộc dự án',
      dataIndex: 'project',
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      render: (p: Task['priority']) => (
        <StatusTag
          status={p}
          colorMap={priorityColors}
          defaultColor="default"
        />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (s: Task['status']) => (
        <StatusTag status={s} colorMap={statusColors} defaultColor="default" />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space wrap style={{ marginBottom: 16 }}>
        <Select placeholder="Lọc trạng thái" style={{ width: 150 }}>
          <Option value="all">Tất cả</Option>
          <Option value="todo">Chưa làm</Option>
          <Option value="doing">Đang làm</Option>
          <Option value="done">Đã xong</Option>
        </Select>
        <RangePicker />
        <Search
          placeholder="Tìm công việc..."
          style={{ width: 200 }}
          allowClear
        />
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm công việc
        </Button>
      </Space>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
    </div>
  );
}
