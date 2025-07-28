import React, { useEffect, useMemo, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Space,
  Popconfirm,
  Modal,
  message,
  Form,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import StatusTag from '@/components/status-tag';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import axios from 'axios';
import EmployeeForm from '@/components/employees-form';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import styles from '@/styles/role-permission/permission.module.css';
import { errors, success } from '@/components/success-error-info';
import {
  createEmployee,
  deleteEmployee,
  Employee,
  getAllEmployee,
  updateEmployee,
} from '@/redux/slice/employee';
import { getAllDepartment } from '@/redux/slice/department';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { UserContext } from '@/context/userContext';
import { defineAbilityFor } from '@/casl/ability';
import { Can } from '@/casl/Can';
import Detail from '@/components/detail-data';
import { goToWithSearchEmployee } from '@/utils/router-helper';
import { useRouter } from 'next/router';

const { Option } = Select;

const statusColors = {
  'Thử việc': 'blue',
  'Đang làm': 'green',
  'Nghỉ phép': 'orange',
  'Tạm nghỉ': 'gold',
  'Đã nghỉ': 'red',
};

export default function EmployeePage({
  data,
  dataDepartments,
  dataPositions,
}: {
  data: [];
  dataDepartments: [];
  dataPositions: [];
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [updateId, setUpdateId] = useState<number>();
  const [dataDetail, setDataDetail] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { search, page, size, status, department } = router.query;
  const searchFilter = Array.isArray(search) ? search[0] : search ?? '';
  const statusFilter = Array.isArray(status) ? status[0] : status ?? '';
  const departmentFilter = Array.isArray(department)
    ? department[0]
    : department ?? '';
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const { user } = React.useContext(UserContext);

  const ability = useMemo(
    () => defineAbilityFor(user.userRole),
    [user.userRole],
  );

  const dataEmployees = useAppSelector((state) => state.employees.dataRender);
  const dataDepartment = useAppSelector(
    (state) => state.departments.dataRender,
  );

  useEffect(() => {
    console.log(department);
    dispatch(
      getAllEmployee({
        data: data,
        search: search,
        status: status || 'all',
        department: department || 'all',
      }),
    );
    dispatch(getAllDepartment({ data: dataDepartments, search: undefined }));
  }, [dispatch, data, dataDepartments, search, department, status]);

  const columns: ColumnsType<Employee> = [
    {
      title: 'Họ tên',
      dataIndex: 'full_name',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      render: (_, record) => (
        <span>
          {record.department ? (record.department as any).name : 'Chưa phân bổ'}
        </span>
      ),
    },
    {
      title: 'Chức vụ',
      dataIndex: 'position',
      render: (_, record) => (
        <span>
          {record.position ? (record.position as any).name : 'Chưa phân bổ'}
        </span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'SĐT',
      dataIndex: 'phone_number',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status) => (
        <StatusTag
          status={status}
          colorMap={statusColors}
          defaultColor="default"
        />
      ),
    },
    {
      title: 'Hành động',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setDataDetail(record);
              setIsOpen(true);
            }}
          />
          <Can I="edit" a="employees" ability={ability}>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                setIsEdit(true);
                setUpdateId(record.id);
                form.setFieldsValue({
                  full_name: record.full_name,
                  birth_date: record.birth_date
                    ? dayjs(record.birth_date)
                    : null,
                  email: record.email,
                  phone_number: record.phone_number,
                  address: record.address,
                  status: record.status,
                  national_id: record.national_id,
                  department_id: record.department_id,
                  position_id: record.position_id,
                  gender: record.gender,
                });
                setIsModalVisible(true);
              }}
            />
          </Can>

          <Can I="delete" a="employees" ability={ability}>
            <Popconfirm
              title="Xoá nhân sự này?"
              onConfirm={() => handleDeleteRow(record)}>
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Can>
        </Space>
      ),
    },
  ];

  const handleSubmitCreate = async (formData: FormData) => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/employees/create`,
        formData,
        {
          withCredentials: true,
        },
      );
      await dispatch(createEmployee(res.data));
      setIsLoading(false);
      success('Thêm nhân sự mới thành công.', messageApi);
      setIsModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      if (!Array.isArray(error.response.data.message))
        errors(error.response.data.message, messageApi);
      else
        errors(error.response.data.message[0].constraints.matches, messageApi);
      setIsLoading(false);
      return;
    }
  };

  const handleSubmitUpdate = async (formData: FormData) => {
    try {
      setIsLoading(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/employees/update/${updateId}`,
        formData,
        {
          withCredentials: true,
        },
      );
      await dispatch(updateEmployee(res.data));
      setIsLoading(false);
      success('Cập nhật thành công.', messageApi);
      setIsModalVisible(false);
      setIsEdit(false);
      form.resetFields();
    } catch (error: any) {
      if (!Array.isArray(error.response.data.message))
        errors(error.response.data.message, messageApi);
      else
        errors(error.response.data.message[0].constraints.matches, messageApi);
      setIsLoading(false);
      return;
    }
  };

  const handleDeleteRow = async (record: any) => {
    try {
      setIsLoading(true);
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/employees/delete`,
        { id: record.id },
        {
          withCredentials: true,
        },
      );
      await dispatch(deleteEmployee(record.id));
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

  if (!dataDepartment || !dataEmployees || !dataPositions) {
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
            goToWithSearchEmployee(
              router,
              searchFilter,
              1,
              Number(value),
              statusFilter,
              departmentFilter,
            );
          }}>
          <Select.Option value="10">10</Select.Option>
          <Select.Option value="20">20</Select.Option>
          <Select.Option value="50">50</Select.Option>
        </Select>
        <Input.Search
          placeholder="Tên hoặc email"
          allowClear
          enterButton
          onSearch={(value) =>
            goToWithSearchEmployee(
              router,
              value,
              1,
              10,
              statusFilter,
              departmentFilter,
            )
          }
        />
        <Select
          allowClear
          showSearch
          className="select-option"
          placeholder="Chọn phòng ban"
          onChange={(value) =>
            goToWithSearchEmployee(
              router,
              searchFilter,
              1,
              Number(size),
              statusFilter,
              value,
            )
          }
          options={[
            { label: 'Tất cả', value: 'all' },
            ...(dataDepartments || []).map(
              (r: { id: number; name: string }) => ({
                label: r.name,
                value: r.id,
              }),
            ),
          ]}
          filterOption={(input, option) =>
            (option?.label as string)
              .toLowerCase()
              .includes(input.toLowerCase())
          }
        />
        <Select
          allowClear
          className="select-option"
          placeholder="Chọn trạng thái"
          style={{ width: 160 }}
          onChange={(value) =>
            goToWithSearchEmployee(
              router,
              searchFilter,
              1,
              Number(size),
              value,
              departmentFilter,
            )
          }>
          <Option value="all">Tất cả</Option>
          <Option value="Thử việc">Thử việc</Option>
          <Option value="Đang làm">Đang làm</Option>
          <Option value="Nghỉ phép">Nghỉ phép</Option>
          <Option value="Tạm nghỉ">Tạm nghỉ</Option>
          <Option value="Đã nghỉ">Đã nghỉ</Option>
        </Select>

        <Can I="create" a="employees" ability={ability}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}>
            Thêm nhân sự
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
          <EmployeeForm
            onSuccess={() => {
              setIsModalVisible(false);
              setIsEdit(false);
              form.resetFields();
            }}
            handleSubmitCreate={handleSubmitCreate}
            handleEdit={handleSubmitUpdate}
            isEdit={isEdit}
            isLoading={isLoading}
            form={form}
            dataDepartments={dataDepartment}
            dataPositions={dataPositions}
          />
        </Modal>
        <Modal
          title={`Thông tin chi tiết nhân sự`}
          open={isOpen}
          onCancel={() => {
            setIsOpen(false);
          }}
          footer={null}
          width={600}>
          <Detail data={dataDetail} type="employees" />
        </Modal>
      </Space>

      <Table
        columns={columns}
        dataSource={dataEmployees}
        pagination={{
          pageSize: Number(size) || 10,
          current: Number(page) || 1,
          showSizeChanger: false,
          onChange: (page: number, pageSize: number) => {
            const searchFilter = Array.isArray(search)
              ? search[0]
              : search ?? '';
            const sizeFilter = Number(size) || 10;
            goToWithSearchEmployee(
              router,
              searchFilter,
              page,
              sizeFilter,
              statusFilter,
              departmentFilter,
            );
          },
        }}
        rowKey="id"
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext,
) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/employees`,
  );
  const resDepartments = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/departments`,
  );
  const resPositions = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BACKEND_URL}/positions`,
  );
  return {
    props: {
      data: res.data,
      dataDepartments: resDepartments.data,
      dataPositions: resPositions.data,
    },
  };
};
