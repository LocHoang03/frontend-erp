import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Permission {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
}

interface PermissionState {
  data: Permission[];
  dataRender: Permission[];
}

const initialState: PermissionState = {
  data: [],
  dataRender: [],
};

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    getAllPermission: (
      state,
      action: PayloadAction<{
        data: Permission[];
        search: string | string[] | undefined;
      }>,
    ) => {
      const search = Array.isArray(action.payload.search)
        ? action.payload.search[0]
        : action.payload.search ?? '';

      state.data = action.payload.data;

      const filteredData = search
        ? state.data.filter((dt) =>
            dt.name.toLowerCase().includes(search.toLowerCase()),
          )
        : [...state.data];

      state.dataRender = filteredData;
    },
  },
});

export const { getAllPermission } = permissionsSlice.actions;
export default permissionsSlice.reducer;
