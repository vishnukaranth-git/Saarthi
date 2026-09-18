import { supabase } from './supabase';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://saarthi-vi73.onrender.com';
const DEFAULT_TIMEOUT_MS = 30000;

export class ApiError extends Error {
  status: number;
  data: unknown;
  isColdStart?: boolean;

  constructor(message: string, status: number, data?: unknown, isColdStart = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.isColdStart = isColdStart;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<T> {
  const sessionData = await supabase.auth.getSession();
  const token = sessionData.data.session?.access_token;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const isSlow = Date.now() - startTime > 10000;

    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      const message =
        typeof errorData === 'object' && errorData !== null && 'detail' in errorData
          ? String((errorData as { detail: unknown }).detail)
          : response.statusText || 'API Request Failed';

      throw new ApiError(message, response.status, errorData, isSlow);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(
        'Request timed out. Saarthi server might be waking up from standby on Render.',
        504,
        null,
        true
      );
    }

    const message = error instanceof Error ? error.message : 'Network error';
    throw new ApiError(message, 0, null);
  }
}

export const api = {
  get: <T>(endpoint: string, timeoutMs?: number) =>
    request<T>(endpoint, { method: 'GET' }, timeoutMs),

  post: <T>(endpoint: string, body?: unknown, timeoutMs?: number) =>
    request<T>(
      endpoint,
      {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      },
      timeoutMs
    ),

  patch: <T>(endpoint: string, body?: unknown, timeoutMs?: number) =>
    request<T>(
      endpoint,
      {
        method: 'PATCH',
        body: body ? JSON.stringify(body) : undefined,
      },
      timeoutMs
    ),

  delete: <T>(endpoint: string, timeoutMs?: number) =>
    request<T>(endpoint, { method: 'DELETE' }, timeoutMs),

  checkHealth: async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' });
      return res.ok;
    } catch {
      return false;
    }
  },
};
