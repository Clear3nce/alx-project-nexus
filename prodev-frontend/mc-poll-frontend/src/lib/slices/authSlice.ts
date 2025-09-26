import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface User {
  username: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const login = createAsyncThunk<User, { username: string; password: string }>(
  'auth/login',
  async (credentials) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { username: credentials.username };
  }
);

export const register = createAsyncThunk<User, { username: string; email: string; password: string }>(
  'auth/register',
  async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { username: data.username, email: data.email };
  }
);

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(login.rejected, (state) => {
        state.loading = false;
        state.error = 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(register.rejected, (state) => {
        state.loading = false;
        state.error = 'Registration failed';
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
