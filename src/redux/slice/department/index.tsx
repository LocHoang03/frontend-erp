// redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Department {
  id: number;
  name: string;
  description?: string;
  code: string;
  created_at: Date;
  updated_at: Date;
  employees: [];
}

interface DepartmentState {
  data: Department[];
  dataRender: Department[];
}

const initialState: DepartmentState = {
  data: [],
  dataRender: [],
};

const DepartmentsSlice = createSlice({
  name: 'Departments',
  initialState,
  reducers: {
    getAllDepartment: (
      state,
      action: PayloadAction<{
        data: Department[];
        search: string | string[] | undefined;
      }>,
    ) => {
      const search = Array.isArray(action.payload.search)
        ? action.payload.search[0]
        : action.payload.search ?? '';

      state.data = action.payload.data;

      const filteredData = search
        ? state.data.filter(
            (dt) =>
              dt.name.toLowerCase().includes(search.toLowerCase()) ||
              dt.code.toLowerCase().includes(search.toLowerCase()),
          )
        : [...state.data];

      state.dataRender = filteredData;
    },
    createDepartment: (state, action: PayloadAction<Department>) => {
      state.dataRender.unshift(action.payload);
      state.data.unshift(action.payload);
    },
    updateDepartment: (state, action: PayloadAction<Department>) => {
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
    deleteDepartment: (state, action: PayloadAction<number>) => {
      const updated = state.data.filter((item) => item.id !== action.payload);

      state.dataRender = updated;
      state.data = updated;
    },
  },
});

export const {
  getAllDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = DepartmentsSlice.actions;
export default DepartmentsSlice.reducer;
