import React from 'react';
import { Row, Col, Card, Statistic, Tabs } from 'antd';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from '@/styles/Home.module.css';
import {
  ShoppingCartOutlined,
  ProjectOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  SwapOutlined,
  FileTextOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Order } from '@/redux/slice/order';
import { Project } from '@/redux/slice/project';
import { Task } from '@/redux/slice/task';
import { Salary } from '@/redux/slice/salary';
import { WarehouseTransfer } from '@/redux/slice/warehouses-transfers';
import { WarehouseTransaction } from '@/redux/slice/warehouses-transaction';
import { Customer } from '@/redux/slice/customer';

interface DashboardProps {
  orders: Order[];
  projects: Project[];
  tasks: Task[];
  salaries: Salary[];
  warehouseTransfers: WarehouseTransfer[];
  warehouseTransactions: WarehouseTransaction[];
  customers: Customer[];
}

const COLORS = ['#1890ff', '#52c41a', '#ff4d4f', '#faad14'];

function groupByDate<T extends { [key: string]: any }>(
  data: T[],
  dateField: keyof T,
  type: 'day' | 'month' | 'year',
  recent: number,
) {
  const result: Record<string, number> = {};
  const now = new Date();
  for (let i = 0; i < recent; i++) {
    let key = '';
    if (type === 'day') {
      const d = new Date();
      d.setDate(d.getDate() - (recent - i - 1));
      key = d.toLocaleDateString('vi-VN');
    } else if (type === 'month') {
      const d = new Date(
        now.getFullYear(),
        now.getMonth() - (recent - i - 1),
        1,
      );
      key = `${d.getMonth() + 1}/${d.getFullYear()}`;
    } else {
      key = `${now.getFullYear() - (recent - i - 1)}`;
    }
    result[key] = 0;
  }

  data.forEach((item) => {
    const raw = item[dateField];
    if (!raw) return;
    const d = new Date(raw);
    let key = '';
    if (type === 'day') key = d.toLocaleDateString('vi-VN');
    else if (type === 'month') key = `${d.getMonth() + 1}/${d.getFullYear()}`;
    else key = `${d.getFullYear()}`;
    if (result[key] !== undefined) result[key]++;
  });

  return Object.entries(result).map(([time, value]) => ({ time, value }));
}

const safeFilterCount = (arr: any[], fn: (item: any) => boolean) =>
  Array.isArray(arr) ? arr.filter(fn).length : 0;

const safeSum = (arr: any[], fn: (item: any) => number) =>
  Array.isArray(arr) ? arr.reduce((a, b) => a + fn(b), 0) : 0;

const renderPieChart = (data: any[]) => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="type"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label>
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>
);

const renderBarChart = (
  data: any[],
  xKey: string,
  yKey: string,
  label: string = 'Giá trị',
) => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xKey} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey={yKey} name={label} fill="#1890ff" />
    </BarChart>
  </ResponsiveContainer>
);

const renderLineChart = (
  data: any[],
  xKey: string,
  yKey: string,
  label: string = 'Giá trị',
) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xKey} />
      <YAxis />
      <Tooltip
        content={({ active, payload, label }) => {
          if (active && payload && payload.length) {
            return (
              <div
                style={{
                  background: 'white',
                  border: '1px solid #ccc',
                  padding: 8,
                }}>
                <p>{label}</p>
                <p style={{ color: '#1890ff' }}>
                  {new Intl.NumberFormat('vi-VN').format(payload[0].value)} ₫
                </p>
              </div>
            );
          }
          return null;
        }}
      />
      <Legend />
      <Line
        type="monotone"
        dataKey={yKey}
        name={label}
        stroke="#1890ff"
        label={({ x, y, value }) => (
          <text x={x} y={y - 10} fill="#1890ff" fontSize={12} textAnchor="top">
            {new Intl.NumberFormat('vi-VN').format(value)} ₫
          </text>
        )}
      />
    </LineChart>
  </ResponsiveContainer>
);

const renderTimeCharts = (data: any[], field: string, label: string) => (
  <Tabs defaultActiveKey="month" style={{ marginTop: 16 }}>
    <Tabs.TabPane tab="Theo ngày" key="day">
      <Card>
        {renderBarChart(
          groupByDate(data, field, 'day', 7),
          'time',
          'value',
          label,
        )}
      </Card>
    </Tabs.TabPane>
    <Tabs.TabPane tab="Theo tháng" key="month">
      <Card>
        {renderBarChart(
          groupByDate(data, field, 'month', 6),
          'time',
          'value',
          label,
        )}
      </Card>
    </Tabs.TabPane>
    <Tabs.TabPane tab="Theo năm" key="year">
      <Card>
        {renderBarChart(
          groupByDate(data, field, 'year', 4),
          'time',
          'value',
          label,
        )}
      </Card>
    </Tabs.TabPane>
  </Tabs>
);

const Dashboard: React.FC<DashboardProps> = ({
  orders,
  projects,
  tasks,
  salaries,
  warehouseTransfers,
  warehouseTransactions,
  customers,
}) => {
  const orderStatusData = [
    {
      type: 'Chờ thanh toán',
      value: safeFilterCount(orders, (o) => o.status === 'Chờ thanh toán'),
    },
    {
      type: 'Đã thanh toán',
      value: safeFilterCount(orders, (o) => o.status === 'Đã thanh toán'),
    },
    {
      type: 'Đã hủy',
      value: safeFilterCount(orders, (o) => o.status === 'Đã hủy'),
    },
  ];

  const projectStatusData = [
    {
      type: 'Đang triển khai',
      value: safeFilterCount(projects, (p) => p.status === 'Đang triển khai'),
    },
    {
      type: 'Đã hoàn thành',
      value: safeFilterCount(projects, (p) => p.status === 'Đã hoàn thành'),
    },
    {
      type: 'Trễ hạn',
      value: safeFilterCount(projects, (p) => p.status === 'Trễ hạn'),
    },
    {
      type: 'Loại bỏ',
      value: safeFilterCount(projects, (p) => p.status === 'Loại bỏ'),
    },
  ];

  const taskStatusData = [
    {
      type: 'Đã hoàn thành',
      value: safeFilterCount(tasks, (t) => t.status === 'Đã hoàn thành'),
    },
    {
      type: 'Đang làm',
      value: safeFilterCount(tasks, (t) => t.status === 'Đang làm'),
    },
    {
      type: 'Quá hạn',
      value: safeFilterCount(tasks, (t) => t.status === 'Quá hạn'),
    },
  ];

  const transferStatusData = [
    {
      type: 'Chưa xác nhận',
      value: safeFilterCount(
        warehouseTransfers,
        (t) => t.status === 'Chưa xác nhận',
      ),
    },
    {
      type: 'Hoàn tất',
      value: safeFilterCount(
        warehouseTransfers,
        (t) => t.status === 'Hoàn tất',
      ),
    },
    {
      type: 'Từ chối',
      value: safeFilterCount(warehouseTransfers, (t) => t.status === 'Từ chối'),
    },
  ];

  const transactionTypeData = [
    {
      type: 'Nhập kho',
      value: safeFilterCount(
        warehouseTransactions,
        (t) => t.type === 'Nhập kho',
      ),
    },
    {
      type: 'Xuất kho',
      value: safeFilterCount(
        warehouseTransactions,
        (t) => t.type === 'Xuất kho',
      ),
    },
  ];

  const salaryByMonth = Array.from({ length: 12 }, (_, i) => {
    const month = `${i + 1}`.padStart(2, '0');
    const total = safeSum(
      salaries.filter((s) => s.salary_month?.slice(5, 7) === month),
      (s) => s.net_salary || 0,
    );
    return { month: `Th${month}`, value: total };
  });

  const currentYear = new Date().getFullYear();
  const validYears = Array.from({ length: 4 }, (_, i) => `${currentYear - i}`);

  const rawSalaryByYear = salaries.reduce((acc, curr) => {
    const year = curr.salary_month?.slice(0, 4);
    if (!year || !validYears.includes(year)) return acc;
    acc[year] = (acc[year] || 0) + (curr.net_salary || 0);
    return acc;
  }, {} as Record<string, number>);

  const salaryByYearData = validYears.sort().map((year) => ({
    year,
    value: rawSalaryByYear[year] || 0,
  }));

  return (
    <main style={{ padding: 24 }}>
      <h1 className={styles.title}>Thống kê tổng quan</h1>
      <Row gutter={[16, 16]}>
        <Col span={3}>
          <Card className={'card-style'}>
            <ShoppingCartOutlined className={'icon-style'} />
            <Statistic title="Đơn hàng" value={orders.length} />
          </Card>
        </Col>
        <Col span={3}>
          <Card className={'card-style'}>
            <ProjectOutlined
              className={'icon-style'}
              style={{ color: '#52c41a' }}
            />
            <Statistic title="Dự án" value={projects.length} />
          </Card>
        </Col>
        <Col span={3}>
          <Card className={'card-style'}>
            <CheckCircleOutlined
              className={'icon-style'}
              style={{ color: '#faad14' }}
            />
            <Statistic title="Công việc" value={tasks.length} />
          </Card>
        </Col>
        <Col span={3}>
          <Card className={'card-style'}>
            <DollarOutlined
              className={'icon-style'}
              style={{ color: '#eb2f96' }}
            />
            <Statistic title="Lương" value={salaries.length} />
          </Card>
        </Col>
        <Col span={3}>
          <Card className={'card-style'}>
            <SwapOutlined
              className={'icon-style'}
              style={{ color: '#722ed1' }}
            />
            <Statistic title="Chuyển kho" value={warehouseTransfers.length} />
          </Card>
        </Col>
        <Col span={3}>
          <Card className={'card-style'}>
            <FileTextOutlined
              className={'icon-style'}
              style={{
                color: '#13c2c2',
              }}
            />
            <Statistic title="Phiếu kho" value={warehouseTransactions.length} />
          </Card>
        </Col>
        <Col span={3}>
          <Card className={'card-style'}>
            <UserOutlined
              className={'icon-style'}
              style={{
                color: '#f5222d',
              }}
            />
            <Statistic title="Khách hàng" value={customers.length} />
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="orders" style={{ marginTop: 32 }}>
        <Tabs.TabPane tab="Đơn hàng" key="orders">
          {renderPieChart(orderStatusData)}
          {renderTimeCharts(orders, 'created_at', 'Đơn hàng')}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Dự án" key="projects">
          {renderPieChart(projectStatusData)}
          {renderTimeCharts(projects, 'created_at', 'Dự án')}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Công việc" key="tasks">
          {renderPieChart(taskStatusData)}
          {renderTimeCharts(tasks, 'created_at', 'Công việc')}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Lương" key="salary">
          {renderLineChart(salaryByMonth, 'month', 'value', 'Tổng tiền trả')}
          {renderLineChart(salaryByYearData, 'year', 'value', 'Tổng tiền trả')}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Chuyển kho" key="warehouseTransfers">
          {renderPieChart(transferStatusData)}
          {renderTimeCharts(warehouseTransfers, 'created_at', 'Số lần chuyển')}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Phiếu kho" key="warehouseTransactions">
          {renderPieChart(transactionTypeData)}
          {renderTimeCharts(warehouseTransactions, 'created_at', 'Số phiếu')}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Khách hàng" key="customers">
          {renderTimeCharts(customers, 'created_at', 'Số khách hàng')}
        </Tabs.TabPane>
      </Tabs>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps<
  DashboardProps
> = async () => {
  const endpoints = [
    'orders',
    'projects',
    'tasks',
    'salaries',
    'warehouse-transfers',
    'warehouse-transactions',
    'customers',
  ];
  const responses = await Promise.all(
    endpoints.map((endpoint) =>
      axios.get(`${process.env.NEXT_PUBLIC_API_BACKEND_URL}/${endpoint}`),
    ),
  );

  return {
    props: {
      orders: responses[0].data || [],
      projects: responses[1].data || [],
      tasks: responses[2].data || [],
      salaries: responses[3].data || [],
      warehouseTransfers: responses[4].data || [],
      warehouseTransactions: responses[5].data || [],
      customers: responses[6].data || [],
    },
  };
};

export default Dashboard;
