// redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../product';

export interface WarehouseProduct {
  id: number;
  quantity: number;
  product: Product;
  warehouse: Warehouse;
}

export interface Warehouse {
  id: number;
  name: string;
  location: string;
  warehouse_products?: WarehouseProduct[];
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
}

interface WarehouseState {
  data: Warehouse[];
  dataRender: Warehouse[];
}

const initialState: WarehouseState = {
  data: [],
  dataRender: [],
};

const WarehousesSlice = createSlice({
  name: 'Warehouses',
  initialState,
  reducers: {
    getAllWarehouse: (
      state,
      action: PayloadAction<{
        data: Warehouse[];
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
              dt.location.toLowerCase().includes(search.toLowerCase()),
          )
        : [...state.data];

      state.dataRender = filteredData;
    },
    createWarehouse: (state, action: PayloadAction<Warehouse>) => {
      state.dataRender.unshift(action.payload);
      state.data.unshift(action.payload);
    },
    updateWarehouse: (state, action: PayloadAction<Warehouse>) => {
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
    deleteWarehouse: (state, action: PayloadAction<number>) => {
      const updated = state.data.filter((item) => item.id !== action.payload);

      state.dataRender = updated;
      state.data = updated;
    },
  },
});

export const {
  getAllWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} = WarehousesSlice.actions;
export default WarehousesSlice.reducer;
