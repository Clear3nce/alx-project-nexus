import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginCredentials, AuthState } from '@/types/auth';
import { authApi } from '@/lib/api/client';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Try to get stored user data
const getStoredUser = (): User | null => {
  if (!isBrowser) return null;
  
  try {
    const token = localStorage.getItem('access_token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
      return { username, token };
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  
  return null;
};

const initialState: AuthState = {
  user: getStoredUser(),
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      
      if (isBrowser) {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('refresh_token', response.refresh);
        localStorage.setItem('username', credentials.username);
      }
      
      return { username: credentials.username, token: response.access };
    } catch (error: unknown) {
        if (error instanceof Error){
            return rejectWithValue(error.message || 'Login failed');
        }
      return rejectWithValue('Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    if (isBrowser) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('username');
    }
  }
);

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
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;