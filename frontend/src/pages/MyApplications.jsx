/**
 * My Applications — Themed
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import { FiFileText, FiExternalLink, FiInbox } from 'react-icons/fi';

const statusStyle = {
    pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    accepted: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    rejected: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
};

export default function MyApplications() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try { const { data } = await API.get('/applications/me'); setApps(data.applications); }
            catch { toast.error('Failed to load applications'); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    if (loading) return <Spinner />;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 relative">
            <div className="orb orb-blue w-[300px] h-[300px] -top-20 right-0 animate-float-slow" />

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3 animate-fade-up">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <FiFileText className="text-white text-lg" />
                </div>
                My Applications
            </h1>

            {apps.length === 0 ? (
                <div className="glass-card rounded-3xl p-16 text-center animate-fade-up">
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
                        <FiInbox className="text-2xl text-gray-400 dark:text-gray-600" />
                    </div>
                    <p className="text-gray-500 text-lg mb-4">No applications yet</p>
                    <Link to="/" className="text-primary-500 hover:text-primary-400 font-semibold text-sm">Browse Jobs →</Link>
                </div>
            ) : (
                <div className="space-y-3 stagger">
                    {apps.map((app) => (
                        <div key={app._id} className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-up">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/60 to-accent-500/40 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                    {app.job?.company?.charAt(0)?.toUpperCase() || 'J'}
                                </div>
                                <div>
                                    <Link to={`/job/${app.job?._id}`} className="text-base font-semibold text-gray-900 dark:text-white hover:text-primary-500 transition-colors flex items-center gap-1.5">
                                        {app.job?.title} <FiExternalLink className="text-xs text-gray-400" />
                                    </Link>
                                    <p className="text-sm text-gray-500">{app.job?.company} · {app.job?.location}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize ${statusStyle[app.status]}`}>
                                {app.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
