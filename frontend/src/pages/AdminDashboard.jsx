/**
 * Admin Dashboard — Themed
 */

import { useEffect, useState } from 'react';
import API from '../services/api';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import { FiUsers, FiBriefcase, FiTrash2, FiShield } from 'react-icons/fi';

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('users');

    useEffect(() => {
        const fetch = async () => {
            try {
                const [uRes, jRes] = await Promise.all([API.get('/admin/users'), API.get('/admin/jobs')]);
                setUsers(uRes.data.users); setJobs(jRes.data.jobs);
            } catch { toast.error('Failed to load data'); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    const deleteUser = async (id) => {
        if (!confirm('Delete this user?')) return;
        try { await API.delete(`/admin/users/${id}`); setUsers((p) => p.filter((u) => u._id !== id)); toast.success('User deleted'); }
        catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    };

    const deleteJob = async (id) => {
        if (!confirm('Delete this job?')) return;
        try { await API.delete(`/admin/jobs/${id}`); setJobs((p) => p.filter((j) => j._id !== id)); toast.success('Job deleted'); }
        catch { toast.error('Failed'); }
    };

    if (loading) return <Spinner />;

    const roleStyle = {
        admin: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
        recruiter: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
        seeker: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10 relative">
            <div className="orb orb-pink w-[300px] h-[300px] -top-20 right-0 animate-float-slow" />

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3 animate-fade-up">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <FiShield className="text-white text-lg" />
                </div>
                Admin Panel
            </h1>

            <div className="grid grid-cols-2 gap-4 mb-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
                <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-primary-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <FiUsers className="text-xl" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{users.length}</p>
                        <p className="text-sm text-gray-500">Total Users</p>
                    </div>
                </div>
                <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-accent-500/20">
                        <FiBriefcase className="text-xl" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{jobs.length}</p>
                        <p className="text-sm text-gray-500">Total Jobs</p>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 mb-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
                {[
                    { key: 'users', label: 'Users', icon: <FiUsers />, count: users.length },
                    { key: 'jobs', label: 'Jobs', icon: <FiBriefcase />, count: jobs.length },
                ].map((t) => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === t.key ? 'btn-gradient' : 'glass text-gray-500 hover:text-primary-500'
                            }`}>
                        {t.icon} {t.label} <span className="text-xs opacity-60">({t.count})</span>
                    </button>
                ))}
            </div>

            {tab === 'users' && (
                <div className="glass-card rounded-2xl overflow-hidden animate-fade-up">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b border-gray-200 dark:border-gray-800/50">
                                    <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-4 text-right font-medium text-xs uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u) => (
                                    <tr key={u._id} className="border-b border-gray-100 dark:border-gray-800/30 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500/60 to-accent-500/40 flex items-center justify-center text-white text-xs font-bold">
                                                    {u.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <span className="text-gray-900 dark:text-white font-medium">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${roleStyle[u.role]}`}>{u.role}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => deleteUser(u._id)} className="p-2 glass hover:border-red-500/20 text-gray-400 hover:text-red-500 rounded-lg transition-all">
                                                <FiTrash2 className="text-sm" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {tab === 'jobs' && (
                <div className="glass-card rounded-2xl overflow-hidden animate-fade-up">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b border-gray-200 dark:border-gray-800/50">
                                    <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider">Company</th>
                                    <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider">Posted By</th>
                                    <th className="px-6 py-4 font-medium text-xs uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-right font-medium text-xs uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.map((j) => (
                                    <tr key={j._id} className="border-b border-gray-100 dark:border-gray-800/30 hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{j.title}</td>
                                        <td className="px-6 py-4 text-gray-500">{j.company}</td>
                                        <td className="px-6 py-4 text-gray-500">{j.createdBy?.name || '—'}</td>
                                        <td className="px-6 py-4 text-gray-400">{new Date(j.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => deleteJob(j._id)} className="p-2 glass hover:border-red-500/20 text-gray-400 hover:text-red-500 rounded-lg transition-all">
                                                <FiTrash2 className="text-sm" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
