/**
 * Register Page — Themed
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiPhone, FiArrowRight } from 'react-icons/fi';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'seeker' });
    const [submitting, setSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const ok = await register(form);
        setSubmitting(false);
        if (ok) navigate('/');
    };

    return (
        <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-10 relative">
            <div className="orb orb-violet w-[500px] h-[500px] -top-40 right-0 animate-float-slow" />
            <div className="orb orb-blue w-[300px] h-[300px] bottom-10 left-0 animate-float" />
            <div className="absolute inset-0 grid-pattern opacity-20" />

            <div className="glass-card rounded-3xl p-8 md:p-10 w-full max-w-md relative animate-fade-up">
                <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-accent-500/50 to-transparent" />

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
                    <p className="text-gray-500 text-sm">Start your journey with JobVault</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-500 mb-1.5 block font-medium uppercase tracking-wider">Full Name</label>
                        <div className="relative">
                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 z-10" />
                            <input name="name" required placeholder="John Doe"
                                value={form.name} onChange={handleChange}
                                className="input-glass w-full" />
                        </div>
                    </div>

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
                            <input name="password" type="password" required minLength={6} placeholder="Min 6 characters"
                                value={form.password} onChange={handleChange}
                                className="input-glass w-full" />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-gray-500 mb-1.5 block font-medium uppercase tracking-wider">Phone (optional)</label>
                        <div className="relative">
                            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600 z-10" />
                            <input name="phone" placeholder="+91 98765 43210"
                                value={form.phone} onChange={handleChange}
                                className="input-glass w-full" />
                        </div>
                    </div>

                    {/* Role Selector */}
                    <div>
                        <label className="text-xs text-gray-500 mb-2 block font-medium uppercase tracking-wider">I am a</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { key: 'seeker', label: 'Job Seeker', emoji: '🔍', desc: 'Find jobs' },
                                { key: 'recruiter', label: 'Recruiter', emoji: '🏢', desc: 'Post jobs' },
                            ].map((r) => (
                                <button key={r.key} type="button" onClick={() => setForm({ ...form, role: r.key })}
                                    className={`p-4 rounded-xl text-left transition-all duration-300 ${form.role === r.key
                                            ? 'bg-gradient-to-br from-primary-600/30 to-accent-600/20 border border-primary-500/30 shadow-lg shadow-primary-500/10'
                                            : 'glass hover:border-primary-300/20 dark:hover:border-gray-700'
                                        }`}
                                >
                                    <span className="text-xl mb-1 block">{r.emoji}</span>
                                    <span className={`text-sm font-semibold block ${form.role === r.key ? 'text-primary-600 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400'}`}>
                                        {r.label}
                                    </span>
                                    <span className="text-xs text-gray-400 dark:text-gray-600">{r.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <button type="submit" disabled={submitting}
                        className="w-full btn-gradient disabled:opacity-50 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 mt-2">
                        {submitting ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>Create Account <FiArrowRight /></>
                        )}
                    </button>
                </form>

                <p className="text-gray-500 text-sm text-center mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-500 hover:text-primary-400 font-semibold transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
