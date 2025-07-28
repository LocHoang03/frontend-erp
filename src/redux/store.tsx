import { configureStore } from '@reduxjs/toolkit';
import permissionsReducer from './slice/permission/index';
import usersReducer from './slice/users/index';
import rolesReducer from './slice/role/index';
import positionsReducer from './slice/position/index';
import departmentsReducer from './slice/department/index';
import employeesReducer from './slice/employee/index';
import productsReducer from './slice/product/index';
import categoriesReducer from './slice/category/index';
import warehousesReducer from './slice/warehouse/index';
import warehouseTransfersReducer from './slice/warehouses-transfers/index';
import attendancesReducer from './slice/attendances/index';
import salariesReducer from './slice/salary/index';
import projectsReducer from './slice/project/index';
import tasksReducer from './slice/task/index';
import ordersReducer from './slice/order/index';
import customersReducer from './slice/customer/index';
import partnersReducer from './slice/partner/index';
import backupRestoresReducer from './slice/backup-restore/index';
import warehouseTransactionsReducer from './slice/warehouses-transaction/index';

export const makeStore = () => {
  return configureStore({
    reducer: {
      permissions: permissionsReducer,
      users: usersReducer,
      roles: rolesReducer,
      positions: positionsReducer,
      departments: departmentsReducer,
      employees: employeesReducer,
      products: productsReducer,
      categories: categoriesReducer,
      warehouses: warehousesReducer,
      warehouseTransfers: warehouseTransfersReducer,
      attendances: attendancesReducer,
      salaries: salariesReducer,
      projects: projectsReducer,
      tasks: tasksReducer,
      orders: ordersReducer,
      customers: customersReducer,
      partners: partnersReducer,
      backupRestores: backupRestoresReducer,
      warehouseTransactions: warehouseTransactionsReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
