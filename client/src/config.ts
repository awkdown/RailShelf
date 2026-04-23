// The base URL for all API requests.
// In production (on Vercel), VITE_API_URL is set to the Render backend URL.
// In development, it's empty so requests go to '/api/...' which the
// Vite proxy forwards to localhost:3000.
export const API_BASE = import.meta.env.VITE_API_URL || "";