export interface User {
    username: string;
    token: string;
  }
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
  }
  
  export interface TokenResponse {
    access: string;
    refresh: string;
  }