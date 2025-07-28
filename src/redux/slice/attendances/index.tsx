// redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Employee } from '../employee';
import dayjs from 'dayjs';

export enum AttendanceStatus {
  ON_TIME = 'Đúng giờ',
  LATE = 'Đi trễ',
  ABSENT = 'Vắng mặt',
}

export interface Attendances {
  id: number;
  employee: Employee;
  work_date: string;
  check_in?: string | null;
  check_out?: string | null;
  status: AttendanceStatus;
  note?: string | null;
  created_at: Date;
  updated_at: Date;
}

interface AttendancesState {
  data: Attendances[];
  dataRender: Attendances[];
}

const initialState: AttendancesState = {
  data: [],
  dataRender: [],
};

const AttendancesSlice = createSlice({
  name: 'Attendances',
  initialState,
  reducers: {
    getAllAttendances: (
      state,
      action: PayloadAction<{
        data: Attendances[];
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

      let filteredData = [...state.data];

      if (search) {
        filteredData = filteredData.filter((dt) =>
          dt.employee.full_name.toLowerCase().includes(search.toLowerCase()),
        );
      }
      if (date !== 'Invalid Date' && date !== '') {
        filteredData = filteredData.filter((dt) =>
          dayjs(dt.work_date).isSame(dayjs(date, 'YYYY-MM-DD'), 'day'),
        );
      }

      if (status !== 'all' && status !== '') {
        filteredData = filteredData.filter((dt) => dt.status === status);
      }

      state.dataRender = filteredData;
    },
    createAttendances: (state, action: PayloadAction<Attendances>) => {
      state.dataRender.unshift(action.payload);
      state.data.unshift(action.payload);
    },
    updateAttendances: (state, action: PayloadAction<Attendances>) => {
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
    deleteAttendances: (state, action: PayloadAction<number>) => {
      const updated = state.data.filter((item) => item.id !== action.payload);

      state.dataRender = updated;
      state.data = updated;
    },
  },
});

export const {
  getAllAttendances,
  createAttendances,
  updateAttendances,
  deleteAttendances,
} = AttendancesSlice.actions;
export default AttendancesSlice.reducer;
