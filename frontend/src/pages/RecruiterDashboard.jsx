/**
 * Recruiter Dashboard — Themed
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import { FiBriefcase, FiUsers, FiTrash2, FiChevronDown, FiChevronUp, FiPlus, FiDownload } from 'react-icons/fi';

const statusStyle = {
    pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    accepted: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    rejected: 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20',
};

export default function RecruiterDashboard() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedJob, setExpandedJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loadingApps, setLoadingApps] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try { const { data } = await API.get('/jobs/me/posted'); setJobs(data.jobs); }
            catch { toast.error('Failed to load jobs'); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    const toggleApplicants = async (jobId) => {
        if (expandedJob === jobId) { setExpandedJob(null); return; }
        try {
            setLoadingApps(true); setExpandedJob(jobId);
            const { data } = await API.get(`/applications/job/${jobId}`);
            setApplicants(data.applications);
        } catch { toast.error('Failed to load applicants'); }
        finally { setLoadingApps(false); }
    };

    const updateStatus = async (appId, status) => {
        try {
            await API.put(`/applications/${appId}`, { status });
            setApplicants((prev) => prev.map((a) => (a._id === appId ? { ...a, status } : a)));
            toast.success(`Application ${status}`);
        } catch { toast.error('Failed to update'); }
    };

    const deleteJob = async (jobId) => {
        if (!confirm('Delete this job?')) return;
        try {
            await API.delete(`/jobs/${jobId}`);
            setJobs((prev) => prev.filter((j) => j._id !== jobId));
            toast.success('Job deleted');
        } catch { toast.error('Failed to delete'); }
    };

    if (loading) return <Spinner />;

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 relative">
            <div className="orb orb-indigo w-[300px] h-[300px] -top-20 -left-20 animate-float-slow" />

            <div className="flex items-center justify-between mb-8 animate-fade-up">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <FiBriefcase className="text-white text-lg" />
                    </div>
                    Dashboard
                </h1>
                <Link to="/post-job" className="btn-gradient px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
                    <FiPlus /> Post Job
                </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8 animate-fade-up" style={{ animationDelay: '100ms' }}>
                <div className="glass-card rounded-2xl p-5 text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{jobs.length}</p>
                    <p className="text-xs text-gray-500">Jobs Posted</p>
                </div>
                <div className="glass-card rounded-2xl p-5 text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">—</p>
                    <p className="text-xs text-gray-500">Total Views</p>
                </div>
                <div className="glass-card rounded-2xl p-5 text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">—</p>
                    <p className="text-xs text-gray-500">Total Applicants</p>
                </div>
            </div>

            {jobs.length === 0 ? (
                <div className="glass-card rounded-3xl p-16 text-center animate-fade-up">
                    <p className="text-gray-500 text-lg">No jobs posted yet.</p>
                </div>
            ) : (
                <div className="space-y-4 stagger">
                    {jobs.map((job) => (
                        <div key={job._id} className="glass-card rounded-2xl overflow-hidden animate-fade-up">
                            <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/60 to-accent-500/40 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                        {job.company?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <Link to={`/job/${job._id}`} className="text-base font-semibold text-gray-900 dark:text-white hover:text-primary-500 transition-colors">{job.title}</Link>
                                        <p className="text-sm text-gray-500">{job.company} · {job.location} · {job.salary}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => toggleApplicants(job._id)}
                                        className="flex items-center gap-1.5 glass hover:border-primary-500/20 text-gray-500 hover:text-primary-500 px-4 py-2 rounded-xl text-sm transition-all">
                                        <FiUsers /> Applicants {expandedJob === job._id ? <FiChevronUp className="text-xs" /> : <FiChevronDown className="text-xs" />}
                                    </button>
                                    <button onClick={() => deleteJob(job._id)}
                                        className="p-2.5 glass hover:border-red-500/20 text-gray-400 hover:text-red-500 rounded-xl transition-all"><FiTrash2 className="text-sm" /></button>
                                </div>
                            </div>

                            {expandedJob === job._id && (
                                <div className="border-t border-gray-200/50 dark:border-gray-800/30 p-5 bg-gray-50/50 dark:bg-black/20">
                                    {loadingApps ? <Spinner /> : applicants.length === 0 ? (
                                        <p className="text-gray-400 text-sm text-center py-6">No applicants yet</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {applicants.map((app) => (
                                                <div key={app._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 glass rounded-xl p-4">
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white text-sm">{app.applicant?.name}</p>
                                                        <p className="text-xs text-gray-500">{app.applicant?.email} · {app.applicant?.phone || 'No phone'}</p>
                                                        {app.resume && (
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <a href={app.resume.replace('/upload/', '/upload/fl_attachment/')}
                                                                    target="_blank" rel="noreferrer"
                                                                    className="inline-flex items-center gap-1 text-xs text-primary-500 hover:text-primary-400 transition-colors font-medium">
                                                                    <FiDownload /> Download Resume
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyle[app.status]}`}>{app.status}</span>
                                                        {app.status === 'pending' && (
                                                            <>
                                                                <button onClick={() => updateStatus(app._id, 'accepted')} className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-medium transition-colors border border-emerald-500/10">Accept</button>
                                                                <button onClick={() => updateStatus(app._id, 'rejected')} className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-medium transition-colors border border-red-500/10">Reject</button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
