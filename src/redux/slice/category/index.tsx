// redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Category {
  id: number;
  name: string;
  description?: string;
  products: any[];
}

interface CategoryState {
  data: Category[];
  dataRender: Category[];
}

const initialState: CategoryState = {
  data: [],
  dataRender: [],
};

const CategoriesSlice = createSlice({
  name: 'Categorys',
  initialState,
  reducers: {
    getAllCategory: (
      state,
      action: PayloadAction<{
        data: Category[];
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
    createCategory: (state, action: PayloadAction<Category>) => {
      state.dataRender.unshift(action.payload);
      state.data.unshift(action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
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
    deleteCategory: (state, action: PayloadAction<number>) => {
      const updated = state.data.filter((item) => item.id !== action.payload);

      state.dataRender = updated;
      state.data = updated;
    },
  },
});

export const {
  getAllCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = CategoriesSlice.actions;
export default CategoriesSlice.reducer;
