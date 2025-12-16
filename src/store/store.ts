import { configureStore } from '@reduxjs/toolkit';
import uploadDetailsSlice from './uploadDetailsSlice';

export const store = configureStore({
  reducer: {
    uploadDetails: uploadDetailsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
