// src/lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function client(endpoint: string, { body, token, ...customConfig }: any = {}) {
  const config: RequestInit = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  config.headers = headers;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message || 'Request failed');
    }
  } catch (error) {
    throw error;
  }
}

export default client;