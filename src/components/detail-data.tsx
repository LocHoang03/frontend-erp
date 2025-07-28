import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  FormInstance,
  Row,
  Col,
} from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';

const { Title } = Typography;

type DetailProps = {
  data: any;
  type: string;
};

const Detail = ({ data, type }: DetailProps) => {
  return (
    <Card style={{ maxWidth: 700, margin: '0 auto' }}>
      <Title level={3}>{`Thông tin chi tiết`}</Title>
      {type === 'attendances' && (
        <>
          <div className="container-detail">
            <p>Nhân viên được chấm công: {data.employee.full_name}</p>
            <p>email: {data.employee.email}</p>
            <p>
              Số điện thoại: {data.employee.phone_number || 'Chưa cập nhật'}
            </p>
            <p>Ngày chấm công: {dayjs(data.work_date).format('DD/MM/YYYY')}</p>
            <p>Giờ vào làm: {data.check_in}</p>
            <p>Giờ tan làm: {data.check_out}</p>
            <p>Đánh giá: {data.status}</p>
            <p>Ghi chú: {data.note || 'Chưa có ghi chú'}</p>
          </div>
        </>
      )}
      {type === 'category-products' && (
        <>
          <div className="container-detail">
            <p>Tên danh mục: {data.name}</p>
            <p>Mô tả: {data.description}</p>
          </div>
        </>
      )}
      {type === 'departments' && (
        <>
          <div className="container-detail">
            <p>Tên phòng ban: {data.name}</p>
            <p>Mã (code): {data.code}</p>
            <p>Mô tả: {data.description}</p>
          </div>
        </>
      )}
      {type === 'employees' && (
        <>
          <Row justify={'space-between'}>
            <Col span={12}>
              <p>Tên nhân viên: {data.full_name}</p>
              <p>Giới tính: {data.gender}</p>
              <p>Địa chỉ: {data.address}</p>
              <p>Số điện thoại: {data.phone_number || 'Chưa cập nhật'}</p>
              <p>Email: {data.email}</p>
              <p>Ngày sinh: {dayjs(data.birth_date).format('DD/MM/YYYY')}</p>
              <p>Số căn cước công dân: {data.national_id}</p>
              <p>Thuộc phòng ban: {data.department.name}</p>
              <p>Vị trí công việc: {data.position.name}</p>
              <p>Trạng thái công việc: {data.status}</p>
            </Col>
            <Col span={10}>
              <Image
                style={{ borderRadius: '50%' }}
                height={200}
                width={200}
                src={data.avatar_url}
                alt={`image-${data.full_name}`}
              />
            </Col>
          </Row>
        </>
      )}
      {type === 'manage-accounts' && (
        <>
          <div className="container-detail">
            <p>Tên tài khoản: {data.username}</p>
            <p>
              Trạng thái:{' '}
              {data.is_active == true ? 'Đang hoạt động' : 'Vô hiệu hóa'}
            </p>
            <p>Thuộc sở hữu nhân viên: {data.employee.full_name}</p>
            <div>
              <p>Các quyền hạn của tài khoản:</p>
              <ul style={{ paddingLeft: 20 }}>
                {Array.from(
                  new Set(
                    data.userRole?.flatMap(
                      (ur: any) =>
                        ur.role?.rolePermissions?.map((rp: any) => ({
                          name: rp.permission?.name,
                          description: rp.permission?.description,
                        })) || [],
                    ) || [],
                  ),
                ).map((permission: any, index: number) => (
                  <li key={index}>
                    {permission.name} - {permission.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
      {type === 'partners' && (
        <>
          <div className="container-detail">
            <p>Tên đối tác: {data.name}</p>
            <p>Số điện thoại: {data.phone || 'Chưa cập nhật'}</p>
            <p>Email: {data.email}</p>
            <p>Địa chỉ: {data.address}</p>
            <p>Mã số thuế: {data.tax_code || 'Chưa cập nhật'}</p>
            <p>Loại đối tác: {data.type}</p>
            <p>
              Trạng thái:{' '}
              {data.is_active == true ? 'Đang hoạt động' : 'Loại bỏ'}
            </p>
          </div>
        </>
      )}
      {type === 'permissions' && (
        <>
          <div className="container-detail">
            <p>Tên quyền: {data.name}</p>
            <p>Mô tả: {data.description}</p>
          </div>
        </>
      )}
      {type === 'positions' && (
        <>
          <div className="container-detail">
            <p>Mã (code): {data.code}</p>
            <p>Tên vị trí: {data.name}</p>
            <p>Mô tả: {data.description}</p>
          </div>
        </>
      )}
      {type === 'products' && (
        <>
          <Row justify={'space-between'}>
            <Col span={12}>
              <p>Tên sản phẩm: {data.name}</p>
              <p>Mô tả: {data.description}</p>
              <p>Giá nhập: {data.original_price}</p>
              <p>Giá bán: {data.unit_price}</p>
              <p>Đơn vị: {data.unit}</p>
              <p>Trạng thái: {data.status}</p>
              <p>Loại sản phẩm: {data.category.name}</p>
              <p>
                Tồn kho:{' '}
                <span>
                  {data.warehouse_products?.reduce(
                    (sum: number, wp: any) => sum + (wp.quantity || 0),
                    0,
                  ) || 0}
                </span>
              </p>
            </Col>
            <Col span={10}>
              {' '}
              <Image
                style={{ borderRadius: '50%' }}
                height={200}
                width={200}
                src={data.avatar_url}
                alt={`product-${data.name}`}
              />
            </Col>
          </Row>
        </>
      )}
      {type === 'projects' && (
        <>
          <div className="container-detail">
            <p>Tên dự án: {data.name}</p>
            <p>Mô tả: {data.description}</p>
            <p>Ngày bắt đầu: {dayjs(data.start_date).format('DD/MM/YYYY')}</p>
            <p>
              Ngày kết thúc:{' '}
              {data.end_date
                ? dayjs(data.end_date).format('DD/MM/YYYY')
                : 'Chưa cập nhật'}
            </p>
            {data.members.length > 0 && (
              <div>
                <p>Các thành viên của dự án:</p>
                <ul style={{ paddingLeft: 20 }}>
                  {Array.from(
                    data?.members?.map((rp: any) => ({
                      name: rp.employee.full_name,
                      email: rp.employee.email,
                    })) || [],
                  ).map((dt: any, index: number) => (
                    <li key={index}>
                      {dt.name} - {dt.email}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <p>Các công việc của dự án:</p>
              <ul style={{ paddingLeft: 20 }}>
                {Array.from(
                  data?.tasks?.map((rp: any) => ({
                    title: rp.title,
                    employee:
                      rp.assigned_employee.full_name +
                      ` (${rp.assigned_employee.email})`,
                  })) || [],
                ).map((dt: any, index: number) => (
                  <li key={index}>
                    {dt.title} - {dt.employee}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
      {type === 'salary' && (
        <>
          <div className="container-detail">
            <p>Nhân viên : {data.employee.full_name}</p>
            <p>email: {data.employee.email}</p>
            <p>
              Số điện thoại: {data.employee.phone_number || 'Chưa cập nhật'}
            </p>
            <p>Lương cơ bản: {data.base_salary}</p>
            <p>Thưởng thêm: {data.bonus}</p>
            <p>Trợ cấp: {data.allowance}</p>
            <p>Khấu trừ: {data.deduction}</p>
            <p>Tổng lương: {data.net_salary}</p>
            <p>Ghi chú: {data.note}</p>
            <p>Trạng thái: {data.status}</p>
          </div>
        </>
      )}
      {type === 'roles' && (
        <>
          <div className="container-detail">
            <p>Tên vai trò: {data.name}</p>
            <p>Mô tả: {data.description}</p>
            <div>
              <p>Các quyền hạn của vai trò này:</p>
              <ul style={{ paddingLeft: 20 }}>
                {Array.from(
                  data?.rolePermissions?.map((rp: any) => ({
                    name: rp.permission?.name,
                    description: rp.permission?.description,
                  })) || [],
                ).map((permission: any, index: number) => (
                  <li key={index}>
                    {permission.name} - {permission.description}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
      {type === 'tasks' && (
        <>
          <div className="container-detail">
            <p>Tên công việc: {data.title}</p>
            <p>Mô tả: {data.description}</p>
            <p>Trạng thái: {data.status}</p>
            <p>Độ ưu tiên: {data.priority}</p>
            <p>Ngày bắt đầu: {dayjs(data.start_date).format('DD/MM/YYYY')}</p>
            <p>Ngày kết thúc:{dayjs(data.end_date).format('DD/MM/YYYY')}</p>
            <p>Thuộc dự án: {data.project.name}</p>
            <p>Nhân sự đảm nhận: {data.assigned_employee.full_name}</p>
          </div>
        </>
      )}
      {type === 'warehouse-transactions' && (
        <>
          <div className="container-detail">
            <p>Loại phiếu: {data.type}</p>
            <p>Đối tác: {data.partner.name}</p>
            <p>Kho chỉ định: {data.warehouse.name}</p>
            <p>Trạng thái: {data.status}</p>
            <p>Ghi chú: {data.note}</p>
            <div>
              <p>Các sản phẩm đã nhập/xuất:</p>
              <ul style={{ paddingLeft: 20 }}>
                {Array.from(
                  new Set(
                    data?.items?.map((rp: any) => ({
                      name: rp.product?.name,
                      quantity: rp.quantity,
                    })) || [],
                  ),
                ).map((dt: any, index: number) => (
                  <li key={index}>
                    {dt.name} - Số lượng: {dt.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
      {type === 'warehouses' && (
        <>
          <div className="container-detail">
            <p>Tên kho: {data.name}</p>
            <p>Vị trí: {data.location}</p>
          </div>
        </>
      )}
      {type === 'warehouse-transfers' && (
        <>
          <div className="container-detail">
            <p>Tên kho chuyển: {data.from_warehouse.name}</p>
            <p>Tên kho nhận: {data.to_warehouse.name}</p>
            <p>Trạng thái: {data.status}</p>
            <p>Ghi chú: {data.note}</p>
            <div>
              <p>Các sản phẩm đã chuyển:</p>
              <ul style={{ paddingLeft: 20 }}>
                {Array.from(
                  new Set(
                    data?.items?.map((rp: any) => ({
                      name: rp.product?.name,
                      quantity: rp.quantity,
                    })) || [],
                  ),
                ).map((dt: any, index: number) => (
                  <li key={index}>
                    {dt.name} - Số lượng: {dt.quantity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
      {type === 'customers' && (
        <>
          <div className="container-detail">
            <p>Tên khách hàng: {data.full_name}</p>
            <p>Email: {data.email}</p>
            <p>Số điện thoại: {data.phone}</p>
            <p>Địa chỉ: {data.address}</p>
          </div>
        </>
      )}{' '}
      {type === 'orders' && (
        <>
          <div className="container-detail">
            <p>Tên khách hàng: {data.customer.full_name}</p>
            <p>Số điện thoại: {data.customer.phone}</p>
            <p>Tổng giá trị đơn hàng: {data.total_amount}</p>
            <p>Trạng thái đơn hàng: {data.status}</p>
            <p>Phương thức thanh toán: {data.payment_method}</p>
            <div>
              <p>Danh sách sản phẩm của đơn hàng:</p>
              <ul style={{ paddingLeft: 20 }}>
                {Array.from(
                  new Set(
                    data?.items?.map((rp: any) => ({
                      name: rp.product?.name,
                      price: rp.product?.unit_price,
                      quantity: rp.quantity,
                    })) || [],
                  ),
                ).map((dt: any, index: number) => (
                  <li key={index}>
                    {dt.name} - Số lượng: {dt.quantity} - Giá:{' '}
                    {new Intl.NumberFormat('vi-VN').format(dt.price)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default Detail;
