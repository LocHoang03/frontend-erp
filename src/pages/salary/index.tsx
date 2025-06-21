import React from 'react';
import { Table, Tag, Button, Select, Space, DatePicker } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import StatusTag from '@/components/status-tag';

const { Option } = Select;
const { MonthPicker } = DatePicker;

interface SalaryRecord {
  key: string;
  name: string;
  month: string;
  baseSalary: number;
  bonus: number;
  deduction: number;
  total: number;
  status: 'Đã thanh toán' | 'Chưa thanh toán';
}

const data: SalaryRecord[] = [
  {
    key: '1',
    name: 'Nguyễn Văn A',
    month: '06/2025',
    baseSalary: 15000000,
    bonus: 1000000,
    deduction: 500000,
    total: 15500000,
    status: 'Đã thanh toán',
  },
  {
    key: '2',
    name: 'Trần Thị B',
    month: '06/2025',
    baseSalary: 12000000,
    bonus: 0,
    deduction: 0,
    total: 12000000,
    status: 'Chưa thanh toán',
  },
];

const statusColors = {
  'Đã thanh toán': 'green',
  'Chưa thanh toán': 'orange',
};

export default function SalaryPage() {
  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'name',
    },
    {
      title: 'Tháng',
      dataIndex: 'month',
    },
    {
      title: 'Lương cơ bản',
      dataIndex: 'baseSalary',
      render: (value: number) => value.toLocaleString('vi-VN') + ' ₫',
    },
    {
      title: 'Thưởng',
      dataIndex: 'bonus',
      render: (value: number) => value.toLocaleString('vi-VN') + ' ₫',
    },
    {
      title: 'Khấu trừ',
      dataIndex: 'deduction',
      render: (value: number) => value.toLocaleString('vi-VN') + ' ₫',
    },
    {
      title: 'Tổng lương',
      dataIndex: 'total',
      render: (value: number) => (
        <strong style={{ color: '#1677ff' }}>
          {value.toLocaleString('vi-VN')} ₫
        </strong>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: SalaryRecord['status']) => (
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
      <Space wrap style={{ marginBottom: 16 }}>
        <MonthPicker placeholder="Chọn tháng" />
        <Select placeholder="Trạng thái" style={{ width: 150 }}>
          <Option value="all">Tất cả</Option>
          <Option value="paid">Đã thanh toán</Option>
          <Option value="unpaid">Chưa thanh toán</Option>
        </Select>
        <Button icon={<DownloadOutlined />}>Xuất bảng lương</Button>
      </Space>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
    </div>
  );
}
