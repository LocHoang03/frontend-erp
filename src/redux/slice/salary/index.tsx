// redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Employee } from '../employee';

export enum SalaryStatus {
  PAID = 'Đã trả lương',
  UNPAID = 'Chưa trả lương',
}
export interface Salary {
  id: number;
  employee: Employee;
  salary_month: string;
  base_salary: number;
  bonus: number;
  allowance: number;
  deduction: number;
  net_salary: number;
  note?: string;
  status: SalaryStatus;
  created_at: Date;
  updated_at: Date;
}

interface SalaryState {
  data: Salary[];
  dataRender: Salary[];
}

const initialState: SalaryState = {
  data: [],
  dataRender: [],
};

const SalariesSlice = createSlice({
  name: 'Salarys',
  initialState,
  reducers: {
    getAllSalary: (
      state,
      action: PayloadAction<{
        data: Salary[];
        search: string | string[] | undefined;
        date: string | string[] | undefined;
        status: string | string[] | undefined;
      }>,
    ) => {
      const search = Array.isArray(action.payload.search)
        ? action.payload.search[0]
        : action.payload.search ?? '';

      const date = Array.isArray(action.payload.date)
        ? action.payload.date[0]
        : action.payload.date ?? '';
      const status = Array.isArray(action.payload.status)
        ? action.payload.status[0]
        : action.payload.status ?? '';

      state.data = action.payload.data;
      console.log(state.data);
      let filteredData = [...state.data];

      if (search) {
        filteredData = filteredData.filter((dt) =>
          dt.employee.full_name.toLowerCase().includes(search.toLowerCase()),
        );
      }
      if (date && date.includes('/')) {
        const [month, year] = date.split('/');
        const formatted = `${year}-${month}`;
        filteredData = filteredData.filter(
          (dt) => dt.salary_month.toString() === formatted.toString(),
        );
      }

      if (status !== 'all' && status !== '') {
        filteredData = filteredData.filter((dt) => dt.status === status);
      }

      state.dataRender = filteredData;
    },
    createSalary: (state, action: PayloadAction<Salary>) => {
      state.dataRender.unshift(action.payload);
      state.data.unshift(action.payload);
    },
    updateSalary: (state, action: PayloadAction<Salary>) => {
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
    deleteSalary: (state, action: PayloadAction<number>) => {
      const updated = state.data.filter((item) => item.id !== action.payload);

      state.dataRender = updated;
      state.data = updated;
    },

    confirmSalary: (state, action: PayloadAction<number>) => {
      const updated = [...state.data];
      const index = updated.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        updated[index] = {
          ...updated[index],
          status: SalaryStatus.PAID,
        };
      }

      state.dataRender = updated;
      state.data = updated;
    },
  },
});

export const {
  getAllSalary,
  createSalary,
  updateSalary,
  deleteSalary,
  confirmSalary,
} = SalariesSlice.actions;
export default SalariesSlice.reducer;
