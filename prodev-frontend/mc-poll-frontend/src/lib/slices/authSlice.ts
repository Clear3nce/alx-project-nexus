'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '@/lib/api/client';

interface User {
  id: number;
  username: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }) => {
    const response = await authApi.login(credentials);
    return response.data.user;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: { username: string; email: string; password: string }) => {
    const response = await authApi.register(data);
    return response.data.user;
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  const response = await authApi.logout();
  return response.data;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
        state.error = 'Login failed';
      })
      // register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state) => {
        state.loading = false;
        state.error = 'Register failed';
      })
      // logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
