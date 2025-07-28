// redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum PartnerType {
  CUSTOMER = 'Khách hàng',
  SUPPLIER = 'Nhà cung cấp',
}

export interface Partner {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  tax_code?: string | null;
  type: PartnerType;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface PartnerState {
  data: Partner[];
  dataRender: Partner[];
}

const initialState: PartnerState = {
  data: [],
  dataRender: [],
};

const PartnersSlice = createSlice({
  name: 'Partners',
  initialState,
  reducers: {
    getAllPartner: (
      state,
      action: PayloadAction<{
        data: Partner[];
        search: string | string[] | undefined;
        type: string | string[] | undefined;
      }>,
    ) => {
      const search = Array.isArray(action.payload.search)
        ? action.payload.search[0]
        : action.payload.search ?? '';
      const type = Array.isArray(action.payload.type)
        ? action.payload.type[0]
        : action.payload.type ?? '';

      state.data = action.payload.data;

      let filteredData = [...state.data];

      if (search) {
        filteredData = filteredData.filter(
          (dt) =>
            dt.name.toLowerCase().includes(search.toLowerCase()) ||
            dt.email?.toLowerCase().includes(search.toLowerCase()),
        );
      }
      if (type !== 'all' && type !== '') {
        filteredData = filteredData.filter((dt) => dt.type === type);
      }

      state.dataRender = filteredData;
    },
    createPartner: (state, action: PayloadAction<Partner>) => {
      state.dataRender.unshift(action.payload);
      state.data.unshift(action.payload);
    },
    updatePartner: (state, action: PayloadAction<Partner>) => {
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
    deletePartner: (state, action: PayloadAction<number>) => {
      const updated = state.data.filter((item) => item.id !== action.payload);

      state.dataRender = updated;
      state.data = updated;
    },
  },
});

export const { getAllPartner, createPartner, updatePartner, deletePartner } =
  PartnersSlice.actions;
export default PartnersSlice.reducer;
