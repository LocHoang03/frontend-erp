import React, { useState } from 'react';
import {
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Select,
  InputNumber,
  Form,
  Input,
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import StatusTag from '@/components/status-tag';

const { Option } = Select;

interface InventoryRecord {
  key: string;
  type: 'Xuất kho' | 'Nhập kho';
  date: string;
  createdBy: string;
  note: string;
  totalItems: number;
  status: 'Đã xử lý' | 'Chờ xử lý';
}

const statusColors = {
  'Đã xử lý': 'green',
  'Chờ xử lý': 'orange',
};

const initialData: InventoryRecord[] = [
  {
    key: '1',
    type: 'Nhập kho',
    date: '2025-06-20',
    createdBy: 'Nguyễn Văn A',
    note: 'Nhập từ nhà cung cấp B',
    totalItems: 120,
    status: 'Đã xử lý',
  },
  {
    key: '2',
    type: 'Xuất kho',
    date: '2025-06-19',
    createdBy: 'Trần Thị B',
    note: 'Xuất giao cho khách C',
    totalItems: 35,
    status: 'Chờ xử lý',
  },
];

export default function InventoryPage() {
  const [data, setData] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleCreate = (values: any) => {
    const newRecord: InventoryRecord = {
      key: String(data.length + 1),
      ...values,
      date: new Date().toISOString().split('T')[0],
      totalItems: values.items?.length || 0,
      status: 'Chờ xử lý',
    };
    setData([newRecord, ...data]);
    setModalOpen(false);
    form.resetFields();
    message.success('Tạo phiếu thành công');
  };

  const columns = [
    {
      title: 'Loại phiếu',
      dataIndex: 'type',
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
    },
    {
      title: 'Số lượng sản phẩm',
      dataIndex: 'totalItems',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: InventoryRecord['status']) => (
        <StatusTag
          status={status}
          colorMap={statusColors}
          defaultColor="default"
        />
        // <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModalOpen(true)}>
          Tạo phiếu xuất/nhập
        </Button>
      </Space>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />

      <Modal
        title="Tạo phiếu xuất/nhập kho"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Tạo"
        cancelText="Hủy">
        <Form layout="vertical" form={form} onFinish={handleCreate}>
          <Form.Item
            name="type"
            label="Loại phiếu"
            rules={[{ required: true }]}>
            <Select placeholder="Chọn loại">
              <Option value="Nhập kho">Nhập kho</Option>
              <Option value="Xuất kho">Xuất kho</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="createdBy"
            label="Người tạo"
            rules={[{ required: true }]}>
            <Input placeholder="Nhập tên người tạo" />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={2} placeholder="Ghi chú thêm (nếu có)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
