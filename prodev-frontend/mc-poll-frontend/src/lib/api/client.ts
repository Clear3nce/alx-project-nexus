// src/lib/api/client.ts

// Mock API client — no axios needed
export const api = {
  get: async (_url: string) => {
    return { data: {} };
  },
  post: async (_url: string, _body?: unknown) => {
    return { data: {} };
  },
};

// Mock authApi for login/register/logout
export const authApi = {
  login: async (credentials: { username: string; password: string }) => {
    return {
      data: { user: { id: 1, username: credentials.username } },
    };
  },

  register: async (data: { username: string; email: string; password: string }) => {
    return {
      data: { user: { id: 1, username: data.username, email: data.email } },
    };
  },

  logout: async () => {
    return { data: { success: true } };
  },
};
