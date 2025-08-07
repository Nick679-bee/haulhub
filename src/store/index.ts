import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './slices/orderSlice';
import notificationReducer from './slices/notificationSlice';
import authReducer from './slices/authSlice';
import haulsReducer from './slices/haulsSlice';

export const store = configureStore({
  reducer: {
    order: orderReducer,
    notifications: notificationReducer,
    auth: authReducer,
    hauls: haulsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;