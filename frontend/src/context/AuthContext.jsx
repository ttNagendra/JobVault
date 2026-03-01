/**
 * Auth Context
 * ──────────────
 * Provides authentication state (user, loading, isAuthenticated)
 * and actions (login, register, logout) to the entire app.
 */

import { createContext, useContext, useEffect, useReducer } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

// ── Initial state ──────────────────────────────────
const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
};

// ── Reducer ────────────────────────────────────────
function authReducer(state, action) {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload, isAuthenticated: true, loading: false };
        case 'LOGOUT':
            return { ...state, user: null, isAuthenticated: false, loading: false };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        default:
            return state;
    }
}

// ── Provider Component ─────────────────────────────
export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check if user is already logged in on mount
    useEffect(() => {
        const loadUser = async () => {
            try {
                const { data } = await API.get('/auth/me');
                if (data.success) {
                    dispatch({ type: 'SET_USER', payload: data.user });
                }
            } catch {
                dispatch({ type: 'LOGOUT' });
            }
        };
        loadUser();
    }, []);

    // ── Register ───────────────────────────────────
    const register = async (formData) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const { data } = await API.post('/auth/register', formData);
            dispatch({ type: 'SET_USER', payload: data.user });
            toast.success(data.message || 'Registered successfully!');
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
            dispatch({ type: 'SET_LOADING', payload: false });
            return false;
        }
    };

    // ── Login ──────────────────────────────────────
    const login = async (formData) => {
        try {
            dispatch({ type: 'SET_LOADING', payload: true });
            const { data } = await API.post('/auth/login', formData);
            dispatch({ type: 'SET_USER', payload: data.user });
            toast.success(data.message || 'Login successful!');
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
            dispatch({ type: 'SET_LOADING', payload: false });
            return false;
        }
    };

    // ── Logout ─────────────────────────────────────
    const logout = async () => {
        try {
            await API.get('/auth/logout');
            dispatch({ type: 'LOGOUT' });
            toast.success('Logged out');
        } catch {
            toast.error('Logout failed');
        }
    };

    return (
        <AuthContext.Provider value={{ ...state, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// ── Custom hook ────────────────────────────────────
export const useAuth = () => useContext(AuthContext);
