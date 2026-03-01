/**
 * Seeker Dashboard — Themed
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import Spinner from '../components/Spinner';
import { FiFileText, FiCheckCircle, FiXCircle, FiClock, FiArrowRight, FiSearch } from 'react-icons/fi';

export default function SeekerDashboard() {
    const { user } = useAuth();
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try { const { data } = await API.get('/applications/me'); setApps(data.applications); }
            catch { /* silent */ }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    const pending = apps.filter((a) => a.status === 'pending').length;
    const accepted = apps.filter((a) => a.status === 'accepted').length;
    const rejected = apps.filter((a) => a.status === 'rejected').length;

    if (loading) return <Spinner />;

    const stats = [
        { label: 'Total', value: apps.length, icon: <FiFileText />, color: 'from-primary-500 to-primary-600', shadow: 'shadow-primary-500/20' },
        { label: 'Pending', value: pending, icon: <FiClock />, color: 'from-amber-500 to-amber-600', shadow: 'shadow-amber-500/20' },
        { label: 'Accepted', value: accepted, icon: <FiCheckCircle />, color: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/20' },
        { label: 'Rejected', value: rejected, icon: <FiXCircle />, color: 'from-red-500 to-red-600', shadow: 'shadow-red-500/20' },
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 relative">
            <div className="orb orb-violet w-[400px] h-[400px] -top-40 right-0 animate-float-slow" />

            <div className="animate-fade-up">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    Welcome back, <span className="gradient-text">{user?.name}</span>
                </h1>
                <p className="text-gray-500 mb-10">Here&apos;s your application overview</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 stagger">
                {stats.map((stat) => (
                    <div key={stat.label} className="glass-card rounded-2xl p-5 animate-fade-up">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-lg mb-3 shadow-lg ${stat.shadow}`}>
                            {stat.icon}
                        </div>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
                <Link to="/" className="glass-card glass-card-hover rounded-2xl p-6 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                            <FiSearch className="text-xl" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Browse Jobs</p>
                            <p className="text-sm text-gray-500">Find your next opportunity</p>
                        </div>
                    </div>
                    <FiArrowRight className="text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </Link>
                <Link to="/my-applications" className="glass-card glass-card-hover rounded-2xl p-6 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-accent-500/20">
                            <FiFileText className="text-xl" />
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">My Applications</p>
                            <p className="text-sm text-gray-500">Track your progress</p>
                        </div>
                    </div>
                    <FiArrowRight className="text-gray-400 group-hover:text-accent-500 group-hover:translate-x-1 transition-all" />
                </Link>
            </div>
        </div>
    );
}
