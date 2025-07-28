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
  DatePicker,
} from 'antd';
import {
  CheckOutlined,
  EditOutlined,
  EyeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import axios from 'axios';
import styles from '@/styles/role-permission/permission.module.css';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { errors, success } from '@/components/success-error-info';
import dayjs from 'dayjs';
import { Employee } from '@/redux/slice/employee';
import {
  confirmSalary,
  createSalary,
  getAllSalary,
  Salary,
  updateSalary,
} from '@/redux/slice/salary';
import SalariesForm from '@/components/salary-form';
import StatusTag from '@/components/status-tag';
import { UserContext } from '@/context/userContext';
import { defineAbilityFor } from '@/casl/ability';
import { Can } from '@/casl/Can';
import Detail from '@/components/detail-data';
import { useRouter } from 'next/router';
import { goToWithSearchAttendancesSalary } from '@/utils/router-helper';

const { Option } = Select;

const statusColors = {
  'Đã trả lương': 'green',
  'Chưa trả lương': 'red',
};

export default function SalariesPage({
  data,
  dataEmployees,
}: {
  data: Salary[];
  dataEmployees: Employee[];
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [dataDetail, setDataDetail] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { search, page, size, date, status } = router.query;
  const searchFilter = Array.isArray(search) ? search[0] : search ?? '';
  const statusFilter = Array.isArray(status) ? status[0] : status ?? '';
  const dateFilter = Array.isArray(date) ? date[0] : date ?? '';
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const dataAttendances = useAppSelector((state) => state.salaries.dataRender);

  const { user } = React.useContext(UserContext);

  const ability = useMemo(
    () => defineAbilityFor(user.userRole),
    [user.userRole],
  );

  useEffect(() => {
    dispatch(
      getAllSalary({
        data: data,
        search: search,
        date: dateFilter,
        status: statusFilter,
      }),
    );
  }, [dispatch, data, search, dateFilter, statusFilter]);

  const handleSubmitCreate = async (dataCreate: any) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/salaries/create`,
        dataCreate,
        {
          withCredentials: true,
        },
      );
      dispatch(createSalary(res.data));
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
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/salaries/update`,
        dataCreate,
        {
          withCredentials: true,
        },
      );
      dispatch(updateSalary(res.data));
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

  const handleConfirm = async (record: any) => {
    try {
      setIsLoading(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/salaries/confirm`,
        { id: record.id },
        {
          withCredentials: true,
        },
      );
      dispatch(confirmSalary(record.id));
      setIsLoading(false);
      success('Xác nhận thành công.', messageApi);
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
      title: 'Tên nhân viên',
      dataIndex: 'employee',
      render: (_: any, record: any) => {
        return <span>{record.employee.full_name}</span>;
      },
    },
    {
      title: 'Kỳ lương',
      dataIndex: 'month_salary',
      render: (_: any, record: any) => {
        return <span>{dayjs(record.salary_month).format('MM/YYYY')}</span>;
      },
    },
    {
      title: 'Lương cơ bản',
      dataIndex: 'base_salary',
      render: (_: any, record: any) => {
        return (
          <span>
            {new Intl.NumberFormat('vi-VN').format(record.base_salary)}
          </span>
        );
      },
    },
    {
      title: 'Thưởng thêm',
      dataIndex: 'bonus',
      render: (_: any, record: any) => {
        return (
          <span>{new Intl.NumberFormat('vi-VN').format(record.bonus)}</span>
        );
      },
    },
    {
      title: 'Trợ cấp',
      dataIndex: 'allowance',
      render: (_: any, record: any) => {
        return (
          <span>{new Intl.NumberFormat('vi-VN').format(record.allowance)}</span>
        );
      },
    },
    {
      title: 'Khấu trừ',
      dataIndex: 'deduction',
      render: (_: any, record: any) => {
        return (
          <span>{new Intl.NumberFormat('vi-VN').format(record.deduction)}</span>
        );
      },
    },
    {
      title: 'Tổng lương',
      dataIndex: 'net_salary',
      render: (_: any, record: any) => {
        return (
          <span
            style={{
              fontWeight: 700,
              color: 'blue',
            }}>
            {new Intl.NumberFormat('vi-VN').format(record.net_salary)}
          </span>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (_: any, record: any) => {
        return (
          <StatusTag
            status={record.status}
            colorMap={statusColors}
            defaultColor="green"
          />
        );
      },
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
          <Can I="edit" a="salary" ability={ability}>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setIsEdit(true);
                setDisabled(record.check_in ? false : true);
                form.setFieldsValue({
                  employee_id: record.employee.id,
                  salary_month: dayjs(record.salary_month + '-01'),
                  base_salary: record.base_salary,
                  bonus: record.bonus,
                  allowance: record.allowance,
                  deduction: record.deduction,
                  note: record.note,
                  id: record.id,
                });
                setIsModalVisible(true);
              }}
            />
          </Can>
          <Can I="edit" a="salary" ability={ability}>
            {record.status !== 'Đã trả lương' && (
              <Popconfirm
                title="Xác nhận đã trả lương nhân sự này?"
                onConfirm={() => handleConfirm(record)}>
                <Button icon={<CheckOutlined />} />
              </Popconfirm>
            )}
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
          picker="month"
          placeholder="Chọn kỳ lương"
          onChange={(value) =>
            goToWithSearchAttendancesSalary(
              router,
              searchFilter,
              1,
              Number(size),
              dayjs(value).format('MM/YYYY'),
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
            { value: 'Đã trả lương', label: 'Đã trả lương' },
            { value: 'Chưa trả lương', label: 'Chưa trả lương' },
          ]}
        />

        <Input.Search
          placeholder="Tìm kiếm tên nhân sự"
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

        <Can I="create" a="salary" ability={ability}>
          <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Thêm mới
          </Button>
        </Can>
        <Modal
          title={`Thông tin chi tiết lương`}
          open={isOpen}
          onCancel={() => {
            setIsOpen(false);
          }}
          footer={null}
          width={400}>
          <Detail data={dataDetail} type="salary" />
        </Modal>
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
          <SalariesForm
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
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/salaries`,
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
