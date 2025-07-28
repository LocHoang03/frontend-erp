// redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Employee } from '../employee';
import { Task } from '../task';

export enum ProjectStatus {
  ACTIVE = 'Đang triển khai',
  DONE = 'Đã hoàn thành',
  OVERDUE = 'Trễ hạn',
  Remove = 'Loại bỏ',
}

export interface Project {
  id: number;
  name: string;
  description?: string | null;
  employee: Employee;
  start_date: Date;
  end_date: Date;
  status: ProjectStatus;
  members: ProjectMember[];
  tasks: Task[];
  created_at: Date;
  updated_at: Date;
}

export interface ProjectMember {
  project_id: number;
  employee_id: number;
  role_in_project: string;
  project: Project;
  employee: Employee;
}

interface ProjectState {
  data: Project[];
  dataRender: Project[];
}

const initialState: ProjectState = {
  data: [],
  dataRender: [],
};

const ProjectsSlice = createSlice({
  name: 'Projects',
  initialState,
  reducers: {
    getAllProject: (
      state,
      action: PayloadAction<{
        data: Project[];
        search: string | string[] | undefined;
        status: string | string[] | undefined;
      }>,
    ) => {
      const search = Array.isArray(action.payload.search)
        ? action.payload.search[0]
        : action.payload.search ?? '';

      const status = Array.isArray(action.payload.status)
        ? action.payload.status[0]
        : action.payload.status ?? '';

      state.data = action.payload.data;

      let filteredData = [...state.data];

      if (search) {
        filteredData = filteredData.filter(
          (dt) =>
            dt.employee.full_name
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            dt.name.toLowerCase().includes(search.toLowerCase()),
        );
      }

      if (status !== 'all' && status !== '') {
        filteredData = filteredData.filter((dt) => dt.status === status);
      }

      state.dataRender = filteredData;
    },
    createProject: (state, action: PayloadAction<Project>) => {
      state.dataRender.unshift(action.payload);
      state.data.unshift(action.payload);
    },
    updateProject: (state, action: PayloadAction<Project>) => {
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
    deleteProject: (state, action: PayloadAction<number>) => {
      const updated = state.data.filter((item) => item.id !== action.payload);

      state.dataRender = updated;
      state.data = updated;
    },
    removeProject: (state, action: PayloadAction<number>) => {
      const updated = [...state.data];
      const index = updated.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        updated[index] = {
          ...updated[index],
          status: ProjectStatus.Remove,
        };
      }
      state.dataRender = updated;
      state.data = updated;
    },
  },
});

export const {
  getAllProject,
  createProject,
  updateProject,
  deleteProject,
  removeProject,
} = ProjectsSlice.actions;
export default ProjectsSlice.reducer;
