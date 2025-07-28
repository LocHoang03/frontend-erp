// redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order } from '../order';

export interface Customer {
  id: number;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  is_deleted: boolean;
  orders: Order[];
  created_at: Date;
  updated_at: Date;
}

interface CustomerState {
  data: Customer[];
  dataRender: Customer[];
}

const initialState: CustomerState = {
  data: [],
  dataRender: [],
};

const CustomersSlice = createSlice({
  name: 'Customers',
  initialState,
  reducers: {
    getAllCustomer: (
      state,
      action: PayloadAction<{
        data: Customer[];
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
              dt.full_name.toLowerCase().includes(search.toLowerCase()) ||
              dt.email?.toLowerCase().includes(search.toLowerCase()) ||
              dt.phone?.toLowerCase().includes(search.toLowerCase()),
          )
        : [...state.data];

      state.dataRender = filteredData;
    },
  },
});

export const { getAllCustomer } = CustomersSlice.actions;
export default CustomersSlice.reducer;
