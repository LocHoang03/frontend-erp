import React from 'react';
import { Table, Tag, Select, Space, DatePicker, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import StatusTag from '@/components/status-tag';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface AttendanceRecord {
  key: string;
  name: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Đúng giờ' | 'Đi muộn' | 'Vắng mặt';
}

const data: AttendanceRecord[] = [
  {
    key: '1',
    name: 'Nguyễn Văn A',
    date: '2025-06-20',
    checkIn: '08:02',
    checkOut: '17:05',
    status: 'Đúng giờ',
  },
  {
    key: '2',
    name: 'Trần Thị B',
    date: '2025-06-20',
    checkIn: '08:20',
    checkOut: '17:10',
    status: 'Đi muộn',
  },
  {
    key: '3',
    name: 'Lê Văn C',
    date: '2025-06-20',
    checkIn: '',
    checkOut: '',
    status: 'Vắng mặt',
  },
];

const statusColors = {
  'Đúng giờ': 'green',
  'Đi muộn': 'orange',
  'Vắng mặt': 'red',
};

export default function AttendancePage() {
  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'name',
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
    },
    {
      title: 'Giờ vào',
      dataIndex: 'checkIn',
    },
    {
      title: 'Giờ ra',
      dataIndex: 'checkOut',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: AttendanceRecord['status']) => (
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
      <Space wrap style={{ marginBottom: 16 }}>
        <RangePicker />
        <Select placeholder="Chọn trạng thái" style={{ width: 150 }}>
          <Option value="all">Tất cả</Option>
          <Option value="on_time">Đúng giờ</Option>
          <Option value="late">Đi muộn</Option>
          <Option value="absent">Vắng mặt</Option>
        </Select>
        <Button icon={<SearchOutlined />}>Lọc</Button>
      </Space>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
    </div>
  );
}
