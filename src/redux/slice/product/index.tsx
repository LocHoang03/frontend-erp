// redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WarehouseProduct } from '../warehouse';
import { Category } from '../category';

export enum ProductStatus {
  ACTIVE = 'Hoạt động',
  INACTIVE = 'Không hoạt động',
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  unit_price: number;
  unit?: string;
  avatar_url?: string;
  avatar_id?: string;
  status: ProductStatus;
  warehouse_products?: WarehouseProduct[];
  category?: Category;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

interface ProductState {
  data: Product[];
  dataRender: Product[];
}

const initialState: ProductState = {
  data: [],
  dataRender: [],
};

const ProductsSlice = createSlice({
  name: 'Products',
  initialState,
  reducers: {
    getAllProduct: (
      state,
      action: PayloadAction<{
        data: Product[];
        search: string | string[] | undefined;
        status: string | string[] | undefined;
        unit: string | string[] | undefined;
      }>,
    ) => {
      const search = Array.isArray(action.payload.search)
        ? action.payload.search[0]
        : action.payload.search ?? '';

      const unit = Array.isArray(action.payload.unit)
        ? action.payload.unit[0]
        : action.payload.unit ?? '';

      const status = Array.isArray(action.payload.status)
        ? action.payload.status[0]
        : action.payload.status ?? '';

      state.data = action.payload.data;

      let filteredData = [...state.data];

      if (search) {
        filteredData = filteredData.filter((dt) =>
          dt.name.toLowerCase().includes(search.toLowerCase()),
        );
      }
      if (unit !== 'all' && unit !== '') {
        filteredData = filteredData = filteredData.filter(
          (dt) => dt.unit === unit,
        );
      }

      if (status !== 'all' && status !== '') {
        filteredData = filteredData.filter((dt) => dt.status === status);
      }

      state.dataRender = filteredData;
    },
    createProduct: (state, action: PayloadAction<Product>) => {
      state.dataRender.unshift(action.payload);
      state.data.unshift(action.payload);
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
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
    deleteProduct: (state, action: PayloadAction<number>) => {
      const updated = state.data.filter((item) => item.id !== action.payload);

      state.dataRender = updated;
      state.data = updated;
    },
  },
});

export const { getAllProduct, createProduct, updateProduct, deleteProduct } =
  ProductsSlice.actions;
export default ProductsSlice.reducer;
