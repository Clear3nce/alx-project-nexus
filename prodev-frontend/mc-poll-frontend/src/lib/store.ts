import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import pollsReducer from './slices/pollsSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      polls: pollsReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];