/**
 * Login Page — Themed
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

export default function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [submitting, setSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const ok = await login(form);
        setSubmitting(false);
        if (ok) navigate('/');
    };

    return (
        <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 relative">
            <div className="orb orb-indigo w-[400px] h-[400px] -top-20 -left-20 animate-float" />
            <div className="orb orb-violet w-[300px] h-[300px] bottom-0 right-0 animate-float-slow" />
            <div className="absolute inset-0 grid-pattern opacity-20" />

            <div className="glass-card rounded-3xl p-8 md:p-10 w-full max-w-md relative animate-fade-up">
                <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-500 text-sm">Sign in to continue to JobVault</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-500 mb-1.5 block font-medium uppercase tracking-wider">Email</label>
                        <div className="relative">
                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 z-10" />
                            <input name="email" type="email" required placeholder="you@example.com"
                                value={form.email} onChange={handleChange}
                                className="input-glass w-full" />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 mb-1.5 block font-medium uppercase tracking-wider">Password</label>
                        <div className="relative">
                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 z-10" />
                            <input name="password" type="password" required placeholder="••••••••"
                                value={form.password} onChange={handleChange}
                                className="input-glass w-full" />
                        </div>
                    </div>

                    <button type="submit" disabled={submitting}
                        className="w-full btn-gradient disabled:opacity-50 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 mt-6">
                        {submitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>Sign In <FiArrowRight /></>
                        )}
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-800" /></div>
                    <div className="relative flex justify-center"><span className="px-3 bg-white dark:bg-[#0d1424] text-gray-400 dark:text-gray-600 text-xs">demo credentials</span></div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700/50 bg-white/50 dark:bg-white/5 p-3 space-y-1">
                        <p className="font-semibold text-emerald-500 mb-1.5">Job Seeker</p>
                        <p className="text-gray-500 dark:text-gray-400"><span className="text-gray-400 dark:text-gray-600">Email:</span> demodevil@gmail.com</p>
                        <p className="text-gray-500 dark:text-gray-400"><span className="text-gray-400 dark:text-gray-600">Pass:</span> 111111</p>
                    </div>
                    <div className="rounded-xl border border-gray-200 dark:border-gray-700/50 bg-white/50 dark:bg-white/5 p-3 space-y-1">
                        <p className="font-semibold text-accent-500 mb-1.5">Recruiter</p>
                        <p className="text-gray-500 dark:text-gray-400"><span className="text-gray-400 dark:text-gray-600">Email:</span> demodevil1@gmail.com</p>
                        <p className="text-gray-500 dark:text-gray-400"><span className="text-gray-400 dark:text-gray-600">Pass:</span> 123456</p>
                    </div>
                </div>

                <p className="text-gray-500 text-sm text-center mt-6">
                    Don&apos;t have an account?{' '}
                    <Link to="/register" className="text-primary-500 hover:text-primary-400 font-semibold transition-colors">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}
