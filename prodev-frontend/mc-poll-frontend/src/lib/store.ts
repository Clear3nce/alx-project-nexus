// src/lib/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import pollsReducer from './slices/pollsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    polls: pollsReducer, // you can keep this if you want
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
