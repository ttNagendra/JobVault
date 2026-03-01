/**
 * Axios API Service
 * -------------------
 * Pre-configured Axios instance that points to the backend API.
 * Includes credential cookies and 401 interceptor.
 */

import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api/v1',
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

// ── Response interceptor: auto-handle 401 ──────────
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Could redirect to login or clear auth state here
            console.warn('Unauthorized — token may have expired.');
        }
        return Promise.reject(error);
    }
);

export default API;
