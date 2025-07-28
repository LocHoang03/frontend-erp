// redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../product';
import { Warehouse } from '../warehouse';
import { User } from '../users';
import { Partner } from '../partner';

export enum WarehouseTransactionStatus {
  PENDING = 'Chưa xử lý',
  COMPLETED = 'Đã xử lý',
  CANCELLED = 'Từ chối',
}

export interface WarehouseTransaction {
  id: number;
  type: 'Nhập kho' | 'Xuất kho';
  partner_id: number;
  partner: Partner;
  warehouse_id?: number | null;
  warehouse?: Warehouse | null;
  items: WarehouseTransactionItem[];
  note?: string | null;
  status: WarehouseTransactionStatus;
  created_at: Date;
  updated_at: Date;
  created_by: User;
}

export interface WarehouseTransactionItem {
  id: number;
  transaction_id: number;
  transaction: WarehouseTransaction;
  product_id: number;
  product: Product;
  quantity: number;
  unit_price?: number | null;
  total_price?: number | null;
}

export interface WarehouseTransactionItem {
  id: number;
  transfer: WarehouseTransaction;
  product: Product;
  quantity: number;
}

interface WarehouseTransactionTransferState {
  data: WarehouseTransaction[];
  dataRender: WarehouseTransaction[];
}

const initialState: WarehouseTransactionTransferState = {
  data: [],
  dataRender: [],
};

const WarehouseTransactionsSlice = createSlice({
  name: 'WarehouseTransactions',
  initialState,
  reducers: {
    getAllWarehouseTransaction: (
      state,
      action: PayloadAction<{
        data: WarehouseTransaction[];
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
            dt.warehouse?.name.toLowerCase().includes(search.toLowerCase()) ||
            dt.partner?.name.toLowerCase().includes(search.toLowerCase()),
        );
      }

      if (status !== 'all' && status !== '') {
        filteredData = filteredData.filter((dt) => dt.status === status);
      }

      state.dataRender = filteredData;
    },
    createWarehouseTransaction: (
      state,
      action: PayloadAction<WarehouseTransaction>,
    ) => {
      state.dataRender.unshift(action.payload);
      state.data.unshift(action.payload);
    },
    updateWarehouseTransaction: (
      state,
      action: PayloadAction<WarehouseTransaction>,
    ) => {
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
    deleteWarehouseTransaction: (state, action: PayloadAction<number>) => {
      const updated = [...state.data];
      const index = updated.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        updated[index] = {
          ...updated[index],
          status: WarehouseTransactionStatus.CANCELLED,
        };
      }

      state.dataRender = updated;
      state.data = updated;
    },

    confirmWarehouseTransaction: (state, action: PayloadAction<number>) => {
      const updated = [...state.data];
      const index = updated.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        updated[index] = {
          ...updated[index],
          status: WarehouseTransactionStatus.COMPLETED,
        };
      }

      state.dataRender = updated;
      state.data = updated;
    },
  },
});

export const {
  getAllWarehouseTransaction,
  createWarehouseTransaction,
  updateWarehouseTransaction,
  deleteWarehouseTransaction,
  confirmWarehouseTransaction,
} = WarehouseTransactionsSlice.actions;
export default WarehouseTransactionsSlice.reducer;
