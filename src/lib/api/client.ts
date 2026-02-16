import { Api } from './api'

const BASE_URL = import.meta.env.VITE_API_URL || 'https://pitbox-ten.vercel.app';

/**
 * Auth Event Bus
 * Allows decoupled components to listen for low-level network auth failures.
 */
export const authEvents = new EventTarget();

/**
 * Custom Fetch Interceptor
 * Wraps the standard fetch to handle global error states like 401 Unauthorized.
 */
const customFetch: typeof fetch = async (input, init) => {
  try {
    const response = await fetch(input, init);

    // Intercept 401 Unauthorized
    if (response.status === 401) {
      // Dispatch event so AuthProvider can handle cleanup/redirect
      // Note: If a Refresh Token endpoint is added, then we would pause the request, refresh, and retry.
      authEvents.dispatchEvent(new Event('unauthorized'));
    }

    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * PitBox API Client Instance
 * Configured with security worker and custom fetch interceptor.
 */
export const apiClient = new Api<string>({
  baseUrl: BASE_URL,
  customFetch: customFetch,
  securityWorker: (token) => {
    if (token) {
      return {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    }
    return {}
  },
})

// Helper to set auth token
export function setAuthToken(token: string) {
  apiClient.setSecurityData(token)
}

// Helper to clear auth token
export function clearAuthToken() {
  apiClient.setSecurityData(null as unknown as string)
}