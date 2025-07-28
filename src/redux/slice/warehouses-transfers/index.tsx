import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../product';
import { Warehouse } from '../warehouse';
import { User } from '../users';

export enum WarehouseTransferStatus {
  PENDING = 'Chưa xác nhận',
  COMPLETED = 'Hoàn tất',
  CANCELLED = 'Từ chối',
}

export interface WarehouseTransfer {
  id: number;
  from_warehouse: Warehouse;
  to_warehouse: Warehouse;
  items: WarehouseTransferItem[];
  created_by?: User | null;
  created_at: Date;
  note?: string | null;
  status: WarehouseTransferStatus;
}

export interface WarehouseTransferItem {
  id: number;
  transfer: WarehouseTransfer;
  product: Product;
  quantity: number;
}

interface WarehouseTransferTransferState {
  data: WarehouseTransfer[];
  dataRender: WarehouseTransfer[];
}

const initialState: WarehouseTransferTransferState = {
  data: [],
  dataRender: [],
};

const WarehouseTransfersSlice = createSlice({
  name: 'WarehouseTransfers',
  initialState,
  reducers: {
    getAllWarehouseTransfer: (
      state,
      action: PayloadAction<{
        data: WarehouseTransfer[];
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
            dt.from_warehouse.name
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            dt.to_warehouse.name.toLowerCase().includes(search.toLowerCase()),
        );
      }

      if (status !== 'all' && status !== '') {
        filteredData = filteredData.filter((dt) => dt.status === status);
      }

      state.dataRender = filteredData;
    },
    createWarehouseTransfer: (
      state,
      action: PayloadAction<WarehouseTransfer>,
    ) => {
      state.dataRender.unshift(action.payload);
      state.data.unshift(action.payload);
    },
    updateWarehouseTransfer: (
      state,
      action: PayloadAction<WarehouseTransfer>,
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
    deleteWarehouseTransfer: (state, action: PayloadAction<number>) => {
      const updated = [...state.data];
      const index = updated.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        updated[index] = {
          ...updated[index],
          status: WarehouseTransferStatus.CANCELLED,
        };
      }

      state.dataRender = updated;
      state.data = updated;
    },

    confirmWarehouseTransfer: (state, action: PayloadAction<number>) => {
      const updated = [...state.data];
      const index = updated.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        updated[index] = {
          ...updated[index],
          status: WarehouseTransferStatus.COMPLETED,
        };
      }

      state.dataRender = updated;
      state.data = updated;
    },
  },
});

export const {
  getAllWarehouseTransfer,
  createWarehouseTransfer,
  updateWarehouseTransfer,
  deleteWarehouseTransfer,
  confirmWarehouseTransfer,
} = WarehouseTransfersSlice.actions;
export default WarehouseTransfersSlice.reducer;
