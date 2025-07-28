import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Popconfirm,
  Modal,
  Form,
  message,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import axios from 'axios';
import styles from '@/styles/role-permission/permission.module.css';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import DepartmentPositionForm from '@/components/department-position-form';
import { errors, success } from '@/components/success-error-info';
import {
  createPosition,
  deletePosition,
  getAllPosition,
  updatePosition,
} from '@/redux/slice/position';
import { UserContext } from '@/context/userContext';
import { defineAbilityFor } from '@/casl/ability';
import { Can } from '@/casl/Can';
import Detail from '@/components/detail-data';
import { useRouter } from 'next/router';
import { goToWithSearch } from '@/utils/router-helper';

const { Option } = Select;

export default function PositionsPage({ data }: { data: any[] }) {
  const [type, setType] = useState('position');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { search, page, size } = router.query;
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const dataPositions = useAppSelector((state) => state.positions.dataRender);

  const { user } = React.useContext(UserContext);

  const ability = useMemo(
    () => defineAbilityFor(user.userRole),
    [user.userRole],
  );

  useEffect(() => {
    dispatch(getAllPosition({ data: data, search: search }));
  }, [dispatch, data, search]);

  const handleSubmitCreate = async (dataCreate: any) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/positions/create`,
        dataCreate,
        {
          withCredentials: true,
        },
      );
      dispatch(createPosition(res.data));
      setIsLoading(false);
      setIsEdit(false);
      success('Thêm phòng ban mới thành công.', messageApi);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      errors(error.response.data.message, messageApi);
      setIsLoading(false);
      return;
    }
  };

  const handleSubmitUpdate = async (dataCreate: any) => {
    try {
      setIsLoading(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/positions/update`,
        dataCreate,
        {
          withCredentials: true,
        },
      );
      dispatch(updatePosition(res.data));
      setIsLoading(false);
      success('Cập nhật thành công.', messageApi);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      errors(error.response.data.message, messageApi);
      setIsLoading(false);
      return;
    }
  };
  const handleDeleteRow = async (record: any) => {
    try {
      setIsLoading(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/positions/delete`,
        { id: record.id },
        {
          withCredentials: true,
        },
      );
      dispatch(deletePosition(record.id));
      setIsLoading(false);
      success('Xóa thành công.', messageApi);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      errors(error.response.data.message, messageApi);
      setIsLoading(false);
      return;
    }
  };

  const columns = [
    {
      title: 'Tên vị trí',
      dataIndex: 'name',
      width: '20%',
    },
    {
      title: 'Mã(code) vị trí',
      dataIndex: 'code',
      width: '20%',
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
          <Can I="edit" a="positions" ability={ability}>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setIsEdit(true);
                form.setFieldsValue({
                  name: record.name,
                  description: record.description,
                  code: record.code,
                  id: record.id,
                });
                setIsModalVisible(true);
              }}
            />
          </Can>
          <Can I="delete" a="positions" ability={ability}>
            <Popconfirm
              title="Xoá vị trí này?"
              onConfirm={() => handleDeleteRow(record)}>
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Can>
        </Space>
      ),
    },
  ];

  if (!dataPositions) {
    return (
      <div className={styles.loading}>
        <p>Vui lòng chờ...</p>
        <LoadingOutlined />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
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
        <Input.Search
          placeholder="Tìm vị trí hoặc mã (code)"
          allowClear
          enterButton
          onSearch={(value) => goToWithSearch(router, value, 1, 10)}
        />
        <Can I="create" a="positions" ability={ability}>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Thêm mới
          </Button>
        </Can>
        <Modal
          title={`${isEdit ? 'Cập nhật' : 'Thêm mới'}`}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setIsEdit(false);
          }}
          footer={null}
          width={800}>
          <DepartmentPositionForm
            onSuccess={() => {
              setIsModalVisible(false);
              setIsEdit(false);
              form.resetFields();
            }}
            handleSubmitCreate={handleSubmitCreate}
            handleSubmitUpdate={handleSubmitUpdate}
            isEdit={isEdit}
            isLoading={isLoading}
            form={form}
            type={type}
          />
        </Modal>{' '}
        <Modal
          title={`Thông tin chi tiết vị trí công việc`}
          open={isOpen}
          onCancel={() => {
            setIsOpen(false);
          }}
          footer={null}
          width={400}>
          <Detail data={dataDetail} type="positions" />
        </Modal>
      </Space>
      <Table
        columns={columns}
        dataSource={dataPositions}
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
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/positions`,
  );
  return {
    props: {
      data: res.data,
    },
  };
};
