// redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '../project';
import { Employee } from '../employee';
import dayjs from 'dayjs';

export enum TaskStatus {
  OVERDUE = 'Quá hạn',
  DOING = 'Đang làm',
  DONE = 'Đã hoàn thành',
}
export enum TaskPriority {
  LOW = 'Thấp',
  MEDIUM = 'Trung bình',
  HIGH = 'Cao',
}

export interface Task {
  id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  start_date?: Date | null;
  end_date?: Date | null;
  project_id?: number | null;
  assigned_to?: number | null;
  project?: Project;
  assigned_employee?: Employee;
  created_at: Date;
  updated_at: Date;
}

interface TaskState {
  data: Task[];
  dataRender: Task[];
}

const initialState: TaskState = {
  data: [],
  dataRender: [],
};

const TasksSlice = createSlice({
  name: 'Tasks',
  initialState,
  reducers: {
    getAllTask: (
      state,
      action: PayloadAction<{
        data: Task[];
        search: string | string[] | undefined;
        status: string | string[] | undefined;
        priority: string | string[] | undefined;
      }>,
    ) => {
      const search = Array.isArray(action.payload.search)
        ? action.payload.search[0]
        : action.payload.search ?? '';

      const priority = Array.isArray(action.payload.priority)
        ? action.payload.priority[0]
        : action.payload.priority ?? '';

      const status = Array.isArray(action.payload.status)
        ? action.payload.status[0]
        : action.payload.status ?? '';

      state.data = action.payload.data;

      let filteredData = [...state.data];

      if (search) {
        filteredData = filteredData.filter(
          (dt) =>
            dt.assigned_employee?.full_name
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            dt.title.toLowerCase().includes(search.toLowerCase()) ||
            dt.project?.name.toLowerCase().includes(search.toLowerCase()),
        );
      }

      if (status !== 'all' && status !== '') {
        filteredData = filteredData.filter((dt) => dt.status === status);
      }
      if (priority !== 'all' && priority !== '') {
        filteredData = filteredData.filter((dt) => dt.priority === priority);
      }

      state.dataRender = filteredData;
    },
    createTask: (state, action: PayloadAction<Task>) => {
      state.dataRender.unshift(action.payload);
      state.data.unshift(action.payload);
    },
    updateTask: (state, action: PayloadAction<Task>) => {
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
    deleteTask: (state, action: PayloadAction<number>) => {
      const updated = state.data.filter((item) => item.id !== action.payload);

      state.dataRender = updated;
      state.data = updated;
    },

    confirmTask: (state, action: PayloadAction<number>) => {
      const updated = [...state.data];
      const index = updated.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        const today = dayjs();
        const compareDate = dayjs(updated[index].end_date);

        const isPast = today.isAfter(compareDate);
        updated[index] = {
          ...updated[index],
          status: isPast ? TaskStatus.OVERDUE : TaskStatus.DONE,
        };
      }
      state.dataRender = updated;
      state.data = updated;
    },
  },
});

export const { getAllTask, createTask, updateTask, deleteTask, confirmTask } =
  TasksSlice.actions;
export default TasksSlice.reducer;
