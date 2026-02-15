import { Api } from './api'

// Get base URL from environment or use default
const BASE_URL = import.meta.env.VITE_API_URL || 'https://pitbox-ten.vercel.app'

// Create and export API client instance with security worker for Bearer token
export const apiClient = new Api<string>({
  baseUrl: BASE_URL,
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
