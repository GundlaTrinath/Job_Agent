// API Configuration
// Production: Always uses Render backend
// Development: Uses localhost

const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

const API_BASE_URL = isProduction
    ? 'https://job-agent-api.onrender.com'
    : 'http://localhost:8000';

export default API_BASE_URL;
