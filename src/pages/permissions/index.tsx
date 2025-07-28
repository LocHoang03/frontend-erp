import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Select, Space, Modal } from 'antd';
import { EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import axios from 'axios';
import styles from '@/styles/role-permission/permission.module.css';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getAllPermission } from '@/redux/slice/permission';
import Detail from '@/components/detail-data';
import { useRouter } from 'next/router';
import { goToWithSearch } from '@/utils/router-helper';

export interface DataPermission {
  name: string;
  description?: string;
}

const { Option } = Select;

export default function PermissionsPage({ data }: { data: any[] }) {
  const [isActive, setIsActive] = useState(true);
  const [dataDetail, setDataDetail] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const { search, page, size } = router.query;

  const dataPermission = useAppSelector(
    (state) => state.permissions.dataRender,
  );
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      getAllPermission({
        data: data,
        search: search,
      }),
    );
  }, [dispatch, data, search]);

  const columns = [
    {
      title: 'Tên quyền',
      dataIndex: 'name',
      width: '30%',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      width: '45%',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      render: (_: any, record: any) => (
        <span style={{ textAlign: 'center' }}>
          {new Date(record['created_at']).toLocaleDateString('vi-VN')}
        </span>
      ),
      width: '15%',
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

  if (!dataPermission) {
    return (
      <div className={styles.loading}>
        <p>Vui lòng chờ...</p>
        <LoadingOutlined />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
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
          <Option value="10">10</Option>
          <Option value="20">20</Option>
          <Option value="50">50</Option>
        </Select>
        <Modal
          title={`Thông tin chi tiết quyền`}
          open={isOpen}
          onCancel={() => {
            setIsOpen(false);
          }}
          footer={null}
          width={400}>
          <Detail data={dataDetail} type="permissions" />
        </Modal>

        <Input.Search
          placeholder="Tìm kiếm tên quyền"
          allowClear
          enterButton
          onSearch={(value) => goToWithSearch(router, value, 1, 10)}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={dataPermission.filter(
          (item) => item.is_active === isActive,
        )}
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
        rowKey="key"
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/permissions`,
  );
  return {
    props: {
      data: res.data,
    },
  };
};
