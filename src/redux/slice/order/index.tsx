// redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../product';
import { Customer } from '../customer';

export enum OrderStatus {
  PENDING = 'Chờ thanh toán',
  PAID = 'Đã thanh toán',
  CANCELED = 'Đã hủy',
}

export enum PaymentType {
  UNKNOWN = 'Chưa xác định',
  COD = 'Tiền mặt',
  BANKING = 'Chuyển khoản ngân hàng',
  E_WALLET = 'Ví điện tử',
}

export interface Order {
  id: number;
  customer?: Customer | null;
  created_at: Date;
  total_amount: number;
  status: OrderStatus;
  payment_method: PaymentType;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  order: Order;
  product?: Product | null;
  quantity: number;
  price: number;
}

interface OrderState {
  data: Order[];
  dataRender: Order[];
}

const initialState: OrderState = {
  data: [],
  dataRender: [],
};

const OrdersSlice = createSlice({
  name: 'Orders',
  initialState,
  reducers: {
    getAllOrder: (
      state,
      action: PayloadAction<{
        data: Order[];
        search: string | string[] | undefined;
        type: string | string[] | undefined;
        status: string | string[] | undefined;
      }>,
    ) => {
      const search = Array.isArray(action.payload.search)
        ? action.payload.search[0]
        : action.payload.search ?? '';

      const type = Array.isArray(action.payload.type)
        ? action.payload.type[0]
        : action.payload.type ?? '';

      const status = Array.isArray(action.payload.status)
        ? action.payload.status[0]
        : action.payload.status ?? '';

      state.data = action.payload.data;

      let filteredData = [...state.data];

      if (search) {
        filteredData = filteredData.filter(
          (dt) =>
            dt.customer?.full_name
              .toLowerCase()
              .includes(search.toLowerCase()) ||
            dt.customer?.phone?.toLowerCase().includes(search.toLowerCase()),
        );
      }
      if (type !== 'all' && type !== '') {
        filteredData = filteredData.filter((dt) => dt.payment_method === type);
      }

      if (status !== 'all' && status !== '') {
        filteredData = filteredData.filter((dt) => dt.status === status);
      }

      state.dataRender = filteredData;
    },
  },
});

export const { getAllOrder } = OrdersSlice.actions;
export default OrdersSlice.reducer;
