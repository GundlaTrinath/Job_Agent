// API Configuration - Change URL here to update everywhere
// For local development: uses VITE_API_URL from .env.local or defaults to localhost
// For production: Vercel will set VITE_API_URL or use production default
const API_BASE_URL = import.meta.env.VITE_API_URL ||
    (import.meta.env.MODE === 'production'
        ? 'https://job-agent-api.onrender.com'
        : 'http://localhost:8000');

export default API_BASE_URL;
