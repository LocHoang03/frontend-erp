import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Modal,
  Form,
  message,
  DatePicker,
} from 'antd';
import { EditOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import axios from 'axios';
import styles from '@/styles/role-permission/permission.module.css';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { errors, success } from '@/components/success-error-info';
import {
  Attendances,
  createAttendances,
  getAllAttendances,
  updateAttendances,
} from '@/redux/slice/attendances';
import dayjs from 'dayjs';
import AttendancesForm from '@/components/attendances-form';
import { Employee } from '@/redux/slice/employee';
import { UserContext } from '@/context/userContext';
import { Can } from '@/casl/Can';
import { defineAbilityFor } from '@/casl/ability';
import Detail from '@/components/detail-data';
import { useRouter } from 'next/router';
import { goToWithSearchAttendancesSalary } from '@/utils/router-helper';

const { Option } = Select;

export default function AttendancesPage({
  data,
  dataEmployees,
}: {
  data: Attendances[];
  dataEmployees: Employee[];
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const router = useRouter();
  const { search, page, size, date, status } = router.query;
  const searchFilter = Array.isArray(search) ? search[0] : search ?? '';
  const statusFilter = Array.isArray(status) ? status[0] : status ?? '';
  const dateFilter = Array.isArray(date) ? date[0] : date ?? '';

  const dispatch = useAppDispatch();
  const { user } = React.useContext(UserContext);

  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const dataAttendances = useAppSelector(
    (state) => state.attendances.dataRender,
  );

  useEffect(() => {
    dispatch(
      getAllAttendances({
        data: data,
        search: searchFilter,
        date: dateFilter,
        status: statusFilter,
      }),
    );
  }, [dispatch, data, searchFilter, dateFilter, statusFilter]);

  const handleSubmitCreate = async (dataCreate: any) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/attendances/create`,
        dataCreate,
        {
          withCredentials: true,
        },
      );
      dispatch(createAttendances(res.data));
      setIsLoading(false);
      success('Thêm mới thành công.', messageApi);
      setIsModalVisible(false);
      setDisabled(false);

      form.resetFields();
      setIsEdit(false);
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
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/attendances/update`,
        dataCreate,
        {
          withCredentials: true,
        },
      );
      dispatch(updateAttendances(res.data));
      setIsLoading(false);
      setDisabled(false);

      setIsEdit(false);
      success('Cập nhật thành công.', messageApi);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      errors(error.response.data.message, messageApi);
      setIsLoading(false);
      return;
    }
  };

  const ability = useMemo(
    () => defineAbilityFor(user.userRole),
    [user.userRole],
  );

  const columns = [
    {
      title: 'Tên nhân viên',
      dataIndex: 'employee',
      render: (_: any, record: any) => {
        return <span>{record.employee.full_name}</span>;
      },
    },
    {
      title: 'Ngày làm việc',
      dataIndex: 'work_date',
      render: (_: any, record: any) => {
        return <span>{dayjs(record.work_date).format('DD/MM/YYYY')}</span>;
      },
    },
    {
      title: 'Giờ vào',
      dataIndex: 'check_in',
      render: (_: any, record: any) => {
        return <span>{record.check_in}</span>;
      },
    },
    {
      title: 'Giờ ra',
      dataIndex: 'check_out',
      render: (_: any, record: any) => {
        return <span>{record.check_out || 'Chưa có'}</span>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
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

          <Can I="edit" a="attendances" ability={ability}>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setIsEdit(true);
                setDisabled(record.check_in ? false : true);
                form.setFieldsValue({
                  employee_id: record.employee.id,
                  work_date: dayjs(record.work_date),
                  check_in: record.check_in
                    ? dayjs(record.check_in, 'HH:mm:ss')
                    : null,
                  check_out: record.check_out
                    ? dayjs(record.check_out, 'HH:mm:ss')
                    : null,
                  note: record.note,
                  id: record.id,
                });
                setIsModalVisible(true);
              }}
            />
          </Can>
        </Space>
      ),
    },
  ];
  if (!dataAttendances) {
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
            goToWithSearchAttendancesSalary(
              router,
              searchFilter,
              1,
              Number(value),
              dateFilter,
              statusFilter,
            );
          }}>
          <Option value="10">10</Option>
          <Option value="20">20</Option>
          <Option value="50">50</Option>
        </Select>
        <DatePicker
          picker="date"
          placeholder="Chọn ngày làm việc"
          onChange={(value) =>
            goToWithSearchAttendancesSalary(
              router,
              searchFilter,
              1,
              Number(size),
              dayjs(value).format('DD/MM/YYYY'),
              statusFilter,
            )
          }
        />
        <Select
          allowClear
          onChange={(value) =>
            goToWithSearchAttendancesSalary(
              router,
              searchFilter,
              1,
              Number(size),
              dateFilter,
              value,
            )
          }
          placeholder="Chọn trạng thái"
          options={[
            { value: 'all', label: 'Tất cả' },
            { value: 'Đúng giờ', label: 'Đúng giờ' },
            { value: 'Đi trễ', label: 'Đi trễ' },
            { value: 'Vắng mặt', label: 'Vắng mặt' },
          ]}
        />
        <Input.Search
          placeholder="Tìm kiếm"
          allowClear
          enterButton
          onSearch={(value) =>
            goToWithSearchAttendancesSalary(
              router,
              value,
              1,
              10,
              dateFilter,
              statusFilter,
            )
          }
        />

        <Can I="create" a="attendances" ability={ability}>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Thêm mới
          </Button>
        </Can>

        <Modal
          title={`${isEdit ? 'Cập nhật' : 'Thêm mới'}`}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setIsEdit(false);
            setDisabled(false);

            form.resetFields();
          }}
          footer={null}
          width={800}>
          <AttendancesForm
            onSuccess={() => {
              setIsModalVisible(false);
              setIsEdit(false);
              setDisabled(false);
              form.resetFields();
            }}
            handleSubmitCreate={handleSubmitCreate}
            handleSubmitUpdate={handleSubmitUpdate}
            isEdit={isEdit}
            isLoading={isLoading}
            form={form}
            dataEmployees={dataEmployees}
            disabled={disabled}
            setDisabled={setDisabled}
          />
        </Modal>

        <Modal
          title={`Thông tin chi tiết chấm công`}
          open={isOpen}
          onCancel={() => {
            setIsOpen(false);
          }}
          footer={null}
          width={400}>
          <Detail data={dataDetail} type="attendances" />
        </Modal>
      </Space>
      <Table
        columns={columns}
        dataSource={dataAttendances}
        pagination={{
          pageSize: Number(size) || 10,
          current: Number(page) || 1,
          showSizeChanger: false,
          onChange: (page: number, pageSize: number) => {
            const searchFilter = Array.isArray(search)
              ? search[0]
              : search ?? '';
            const sizeFilter = Number(size) || 10;
            goToWithSearchAttendancesSalary(
              router,
              searchFilter,
              page,
              sizeFilter,
              dateFilter,
              statusFilter,
            );
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
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/attendances`,
  );
  const resEmployees = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/employees`,
  );
  return {
    props: {
      data: res.data,
      dataEmployees: resEmployees.data,
    },
  };
};
