import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Select, Space, Table } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import axios from 'axios';
import { getAllCustomer } from '@/redux/slice/customer';
import { useRouter } from 'next/router';
import { goToWithSearch } from '@/utils/router-helper';
import Detail from '@/components/detail-data';

export default function Users({ data }: { data: [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const dataUser = useAppSelector((state) => state.customers.dataRender);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { search, page, size } = router.query;

  useEffect(() => {
    dispatch(getAllCustomer({ data: data, search: search }));
  }, [dispatch, data, search]);

  const columns = [
    {
      title: 'Tên khách hàng',
      dataIndex: 'full_name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (_: any, record: any) => (
        <span>{record.email ? record.email : 'Chưa cập nhật'}</span>
      ),
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      render: (_: any, record: any) => (
        <span>{record.phone ? record.phone : 'Chưa cập nhật'}</span>
      ),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
    },

    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setDataDetail(record);
              setIsOpen(true);
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Quản lý tài khoản người dùng</h2>
      <Space style={{ marginBottom: 16 }} wrap>
        <span>Trình diễn</span>
        <Select
          defaultValue="10"
          onChange={(value) => {
            const searchFilter = Array.isArray(search)
              ? search[0]
              : search ?? '';
            goToWithSearch(router, searchFilter, 1, Number(value));
          }}>
          <Select.Option value="10">10</Select.Option>
          <Select.Option value="20">20</Select.Option>
          <Select.Option value="50">50</Select.Option>
        </Select>

        <Input.Search
          placeholder="Tên/email/số điện thoại khách hàng"
          allowClear
          enterButton
          className="search-input"
          onSearch={(value) => goToWithSearch(router, value, 1, 10)}
        />

        <Modal
          title={`Thông tin chi tiết khách hàng`}
          open={isOpen}
          onCancel={() => {
            setIsOpen(false);
          }}
          footer={null}
          width={600}>
          <Detail data={dataDetail} type="customers" />
        </Modal>
      </Space>
      <Table
        columns={columns}
        dataSource={dataUser}
        pagination={{
          pageSize: Number(size) || 10,
          current: Number(page) || 1,
          showSizeChanger: false,
          onChange: (page: number, pageSize: number) => {
            const searchFilter = Array.isArray(search)
              ? search[0]
              : search ?? '';
            const sizeFilter = Number(size) || 10;
            goToWithSearch(router, searchFilter, page, sizeFilter);
          },
        }}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/customers`,
  );

  return {
    props: {
      data: res.data,
    },
  };
};
