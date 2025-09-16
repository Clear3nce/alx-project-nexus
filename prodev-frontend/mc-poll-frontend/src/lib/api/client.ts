import { TokenResponse } from '@/types/auth';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const base = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000/api";
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...init.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(`${base}${path}`, { 
    ...init, 
    headers,
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new ApiError(res.status, errorText || `HTTP error ${res.status}`);
  }
  
  return res.json() as T;
};

// Auth-specific API calls
export const authApi = {
  login: (credentials: { username: string; password: string }) => 
    api<TokenResponse>('/auth/token/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  
  refresh: (refreshToken: string) =>
    api<TokenResponse>('/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshToken }),
    }),
};