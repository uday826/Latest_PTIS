const getEnvVar = (name: string, defaultValue: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[name]) {
    return process.env[name] as string;
  }
  // Check NEXT_PUBLIC prefix for Next.js compatibility
  const nextName = `NEXT_PUBLIC_${name}`;
  if (typeof process !== 'undefined' && process.env && process.env[nextName]) {
    return process.env[nextName] as string;
  }
  // Vite standard import.meta.env check
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[name]) {
    // @ts-ignore
    return import.meta.env[name] as string;
  }
  return defaultValue;
};

export const apiConfig = {
  baseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000/api'),
  useMock: getEnvVar('VITE_USE_MOCK_API', 'true') !== 'false', // Defaults to true if not explicitly false
};

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  validationErrors?: Record<string, string[]>;
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${apiConfig.baseUrl}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const apiError: ApiError = {
        status: response.status,
        message: errorData.message || 'API request failed',
        code: errorData.code,
        validationErrors: errorData.validationErrors
      };
      throw apiError;
    }

    return response.json() as Promise<T>;
  } catch (error: any) {
    if (error.status) throw error; // Re-throw ApiError
    throw {
      status: 500,
      message: error.message || 'Internal connection error',
    } as ApiError;
  }
}
