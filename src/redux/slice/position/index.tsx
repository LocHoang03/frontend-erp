// redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Position {
  id: number;
  name: string;
  description?: string;
  code: string;
  created_at: Date;
  updated_at: Date;
  employees: [];
}

interface PositionState {
  data: Position[];
  dataRender: Position[];
}

const initialState: PositionState = {
  data: [],
  dataRender: [],
};

const PositionsSlice = createSlice({
  name: 'Positions',
  initialState,
  reducers: {
    getAllPosition: (
      state,
      action: PayloadAction<{
        data: Position[];
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
    createPosition: (state, action: PayloadAction<Position>) => {
      state.dataRender.unshift(action.payload);
      state.data.unshift(action.payload);
    },
    updatePosition: (state, action: PayloadAction<Position>) => {
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
    deletePosition: (state, action: PayloadAction<number>) => {
      const updated = state.data.filter((item) => item.id !== action.payload);

      state.dataRender = updated;
      state.data = updated;
    },
  },
});

export const {
  getAllPosition,
  createPosition,
  updatePosition,
  deletePosition,
} = PositionsSlice.actions;
export default PositionsSlice.reducer;
