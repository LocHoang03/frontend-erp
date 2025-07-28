// redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Role {
  id: number;
  name: string;
}

interface RoleState {
  data: Role[];
  dataRender: Role[];
}

const initialState: RoleState = {
  data: [],
  dataRender: [],
};

const RolesSlice = createSlice({
  name: 'Roles',
  initialState,
  reducers: {
    getAllRole: (
      state,
      action: PayloadAction<{
        data: Role[];
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
    createRole: (state, action: PayloadAction<Role>) => {
      state.dataRender.unshift(action.payload);
      state.data.unshift(action.payload);
    },
    updateRole: (state, action: PayloadAction<Role>) => {
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
    deleteRole: (state, action: PayloadAction<number>) => {
      const updated = state.data.filter((item) => item.id !== action.payload);

      state.dataRender = updated;
      state.data = updated;
    },
    // searchRole: (state, action: PayloadAction<string>) => {
    //   const keyword = action.payload.trim().toLowerCase();

    //   if (keyword === '') {
    //     state.dataRender = state.data;
    //   } else {
    //     state.dataRender = state.data.filter((dt) =>
    //       dt.name.toLowerCase().includes(keyword),
    //     );
    //   }
    // },
  },
});

export const {
  getAllRole,
  createRole,
  updateRole,
  deleteRole,
  // searchRole,
} = RolesSlice.actions;
export default RolesSlice.reducer;
