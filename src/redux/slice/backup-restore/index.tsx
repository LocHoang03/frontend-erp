// redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  data: [] as any[],
};

const BackupRestoreSlice = createSlice({
  name: 'BackupRestore',
  initialState,
  reducers: {
    getAllBackupRestore: (state, action: PayloadAction<any[]>) => {
      state.data = action.payload;
    },
  },
});

export const { getAllBackupRestore } = BackupRestoreSlice.actions;
export default BackupRestoreSlice.reducer;
