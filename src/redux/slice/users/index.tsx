// redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Permission } from '../permission';
import { Role } from '../role';
import { Employee } from '../employee';

export interface User {
  id: number;
  username: string;
  password: string;
  is_active: boolean;
  is_delete: boolean;
  can_query: boolean;
  created_at: Date;
  userRole: UserRole[];
  employee: Employee;
}

export interface UserRole {
  role_id: number;
  user_id: number;
  role?: Role;
  user?: User;
}

interface UserState {
  data: User[];
  dataRender: User[];
}

const initialState: UserState = {
  data: [],
  dataRender: [],
};

const UsersSlice = createSlice({
  name: 'Users',
  initialState,
  reducers: {
    getAllUser: (
      state,
      action: PayloadAction<{
        data: User[];
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
              dt.username.toLowerCase().includes(search.toLowerCase()) ||
              dt.employee?.email?.toLowerCase().includes(search.toLowerCase()),
          )
        : [...state.data];

      state.dataRender = filteredData;
    },
    createUser: (state, action: PayloadAction<User>) => {
      state.dataRender.unshift(action.payload);
      state.data.unshift(action.payload);
    },
    updateUser: (state, action: PayloadAction<User>) => {
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
    deleteUser: (state, action: PayloadAction<User>) => {
      const updated = [...state.data];
      const index = updated.findIndex((item) => item.id === action.payload.id);
      if (index !== -1) {
        updated.splice(index, 1);
      }
      state.dataRender = updated;
      state.data = updated;
    },
  },
});

export const { getAllUser, createUser, updateUser, deleteUser } =
  UsersSlice.actions;
export default UsersSlice.reducer;
