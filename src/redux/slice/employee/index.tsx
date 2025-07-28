import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Department } from '../department';
import { Position } from '../position';

export enum EmployeeStatus {
  PROBATION = 'Thử việc',
  WORKING = 'Đang làm',
  LEAVE = 'Nghỉ phép',
  TEMPORARY_STOP = 'Tạm nghỉ',
  QUIT = 'Đã nghỉ',
}

export interface Employee {
  id: number;
  full_name: string;
  gender: 'Nam' | 'Nữ';
  birth_date?: string;
  address?: string;
  phone_number?: string;
  email?: string;
  avatar_url?: string;
  avatar_id?: string;
  status?: EmployeeStatus;
  national_id: string;
  department_id?: number;
  position_id?: number;
  department?: Department;
  position?: Position;
}

interface EmployeeState {
  data: Employee[];
  dataRender: Employee[];
}

const initialState: EmployeeState = {
  data: [],
  dataRender: [],
};

const EmployeesSlice = createSlice({
  name: 'Employees',
  initialState,
  reducers: {
    getAllEmployee: (
      state,
      action: PayloadAction<{
        data: Employee[];
        search: string | string[] | undefined;
        department: string | string[] | undefined;
        status: string | string[] | undefined;
      }>,
    ) => {
      const search = Array.isArray(action.payload.search)
        ? action.payload.search[0]
        : action.payload.search ?? '';

      const department = Array.isArray(action.payload.department)
        ? action.payload.department[0]
        : action.payload.department ?? '';

      const status = Array.isArray(action.payload.status)
        ? action.payload.status[0]
        : action.payload.status ?? '';

      state.data = action.payload.data;

      let filteredData = [...state.data];

      if (search) {
        filteredData = filteredData.filter(
          (dt) =>
            dt.full_name.toLowerCase().includes(search.toLowerCase()) ||
            dt.email?.toLowerCase().includes(search.toLowerCase()),
        );
      }
      if (department !== 'all' && department !== '') {
        filteredData = filteredData.filter(
          (dt) => Number(dt.department_id) === Number(department),
        );
      }

      if (status !== 'all' && status !== '') {
        filteredData = filteredData.filter((dt) => dt.status === status);
      }

      state.dataRender = filteredData;
    },
    createEmployee: (state, action: PayloadAction<Employee>) => {
      state.dataRender.unshift(action.payload);
      state.data.unshift(action.payload);
    },
    updateEmployee: (state, action: PayloadAction<Employee>) => {
      const updated = [...state.data];
      const index = updated.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        updated[index] = {
          ...action.payload,
        };
      }
      state.dataRender = updated;
      state.data = updated;
    },
    deleteEmployee: (state, action: PayloadAction<number>) => {
      const updated = state.data.filter((item) => item.id !== action.payload);

      state.dataRender = updated;
      state.data = updated;
    },
  },
});

export const {
  getAllEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = EmployeesSlice.actions;
export default EmployeesSlice.reducer;
