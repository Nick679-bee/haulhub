import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './slices/orderSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    order: orderReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;