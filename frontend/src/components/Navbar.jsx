/**
 * Navbar — Glassmorphism with theme toggle
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { HiMenu, HiX } from 'react-icons/hi';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navLink = 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white transition-all duration-300 text-sm font-medium';

    return (
        <nav className="glass-nav sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo text only */}
                    <Link to="/" className="text-xl font-bold gradient-text">
                        JobVault
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className={navLink}>Jobs</Link>

                        {isAuthenticated ? (
                            <>
                                {user?.role === 'recruiter' && (
                                    <>
                                        <Link to="/post-job" className={navLink}>Post Job</Link>
                                        <Link to="/dashboard/recruiter" className={navLink}>Dashboard</Link>
                                    </>
                                )}
                                {user?.role === 'seeker' && (
                                    <>
                                        <Link to="/my-applications" className={navLink}>Applications</Link>
                                        <Link to="/dashboard/seeker" className={navLink}>Dashboard</Link>
                                    </>
                                )}
                                {user?.role === 'admin' && (
                                    <Link to="/dashboard/admin" className={navLink}>Admin Panel</Link>
                                )}

                                <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200 dark:border-gray-800">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                                            {user?.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div className="hidden lg:block">
                                            <p className="text-sm text-gray-800 dark:text-white font-medium leading-none">{user?.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-500 capitalize">{user?.role}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-500 hover:text-red-500 dark:hover:text-red-400 text-sm transition-colors ml-1"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className={navLink}>Login</Link>
                                <Link
                                    to="/register"
                                    className="btn-gradient px-5 py-2 rounded-xl text-sm font-semibold"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="ml-2 p-2.5 rounded-xl glass text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-white transition-all"
                            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
                        </button>
                    </div>

                    {/* Mobile: theme + menu */}
                    <div className="md:hidden flex items-center gap-2">
                        <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-600 dark:text-gray-400">
                            {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
                        </button>
                        <button className="text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-white transition-colors" onClick={() => setOpen(!open)}>
                            {open ? <HiX size={22} /> : <HiMenu size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {open && (
                <div className="md:hidden px-4 pb-4 space-y-1 border-t border-gray-200/50 dark:border-gray-800/50 animate-fade-up">
                    <Link to="/" onClick={() => setOpen(false)} className="block py-2.5 text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-white text-sm">Jobs</Link>
                    {isAuthenticated ? (
                        <>
                            {user?.role === 'recruiter' && (
                                <>
                                    <Link to="/post-job" onClick={() => setOpen(false)} className="block py-2.5 text-gray-600 dark:text-gray-400 hover:text-primary-500 text-sm">Post Job</Link>
                                    <Link to="/dashboard/recruiter" onClick={() => setOpen(false)} className="block py-2.5 text-gray-600 dark:text-gray-400 hover:text-primary-500 text-sm">Dashboard</Link>
                                </>
                            )}
                            {user?.role === 'seeker' && (
                                <>
                                    <Link to="/my-applications" onClick={() => setOpen(false)} className="block py-2.5 text-gray-600 dark:text-gray-400 hover:text-primary-500 text-sm">Applications</Link>
                                    <Link to="/dashboard/seeker" onClick={() => setOpen(false)} className="block py-2.5 text-gray-600 dark:text-gray-400 hover:text-primary-500 text-sm">Dashboard</Link>
                                </>
                            )}
                            {user?.role === 'admin' && (
                                <Link to="/dashboard/admin" onClick={() => setOpen(false)} className="block py-2.5 text-gray-600 dark:text-gray-400 hover:text-primary-500 text-sm">Admin Panel</Link>
                            )}
                            <button onClick={() => { handleLogout(); setOpen(false); }} className="block w-full text-left py-2.5 text-red-500 text-sm">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setOpen(false)} className="block py-2.5 text-gray-600 dark:text-gray-400 hover:text-primary-500 text-sm">Login</Link>
                            <Link to="/register" onClick={() => setOpen(false)} className="block py-2.5 text-primary-500 text-sm font-medium">Register</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
