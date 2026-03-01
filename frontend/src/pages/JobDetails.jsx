/**
 * Job Details — Themed
 */

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import { FiMapPin, FiDollarSign, FiCalendar, FiArrowLeft, FiBriefcase, FiUser, FiCheck, FiUpload } from 'react-icons/fi';

export default function JobDetails() {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            try { const { data } = await API.get(`/jobs/${id}`); setJob(data.job); }
            catch { toast.error('Failed to load job'); }
            finally { setLoading(false); }
        };
        fetchJob();
    }, [id]);

    // Handle resume file selection — PDF only
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type !== 'application/pdf') {
            toast.error('Only PDF files are allowed');
            e.target.value = '';
            return;
        }
        if (file && file.size > 5 * 1024 * 1024) {
            toast.error('File too large. Maximum size is 5MB');
            e.target.value = '';
            return;
        }
        setResumeFile(file || null);
    };

    // Submit application with resume as FormData
    const handleApply = async () => {
        if (!resumeFile) {
            toast.error('Please upload your resume (PDF)');
            return;
        }
        try {
            setApplying(true);
            const formData = new FormData();
            formData.append('resume', resumeFile);
            await API.post(`/applications/apply/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Application submitted!');
            setApplied(true);
        } catch (err) { toast.error(err.response?.data?.message || 'Failed to apply'); }
        finally { setApplying(false); }
    };

    if (loading) return <Spinner />;
    if (!job) return <p className="text-center text-gray-500 py-24">Job not found.</p>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 relative">
            <div className="orb orb-indigo w-[300px] h-[300px] -top-20 right-0 animate-float-slow" />

            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-500 mb-8 transition-all group text-sm">
                <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Jobs
            </Link>

            <div className="glass-card rounded-3xl p-8 md:p-10 relative animate-fade-up">
                <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />

                <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-xl shadow-primary-500/20">
                        {job.company?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">{job.title}</h1>
                        <div className="flex flex-wrap gap-3 text-sm">
                            {[
                                { icon: <FiBriefcase className="text-primary-500" />, text: job.company },
                                { icon: <FiMapPin className="text-primary-500" />, text: job.location },
                                { icon: <FiDollarSign className="text-emerald-500" />, text: job.salary },
                                { icon: <FiCalendar className="text-accent-500" />, text: new Date(job.createdAt).toLocaleDateString() },
                            ].map((item, i) => (
                                <span key={i} className="flex items-center gap-1.5 text-gray-500 bg-gray-100 dark:bg-gray-800/30 px-3 py-1.5 rounded-lg">
                                    {item.icon} {item.text}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Description</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{job.description}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                    <span className="badge-gradient text-primary-600 dark:text-primary-300 text-xs px-3 py-1.5 rounded-full font-medium">{job.category}</span>
                </div>

                {job.createdBy && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                        <FiUser className="text-gray-400" />
                        Posted by <span className="text-gray-700 dark:text-gray-300 font-medium">{job.createdBy.name}</span>
                    </div>
                )}

                {isAuthenticated && user?.role === 'seeker' && !applied && (
                    <div className="space-y-4">
                        {/* Resume file picker */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <label
                                htmlFor="resume-upload"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-500 hover:text-primary-500 transition-all cursor-pointer text-sm font-medium"
                            >
                                <FiUpload className="text-lg" />
                                {resumeFile ? resumeFile.name : 'Upload Resume (PDF)'}
                            </label>
                            <input
                                id="resume-upload"
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            {resumeFile && (
                                <span className="text-xs text-gray-400">
                                    {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                                </span>
                            )}
                        </div>

                        {/* Apply button */}
                        <button onClick={handleApply} disabled={applying}
                            className="w-full md:w-auto px-10 py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 btn-gradient">
                            {applying ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Apply Now'}
                        </button>
                    </div>
                )}

                {isAuthenticated && user?.role === 'seeker' && applied && (
                    <button disabled className="w-full md:w-auto px-10 py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <FiCheck /> Applied
                    </button>
                )}

                {!isAuthenticated && (
                    <p className="text-gray-500 text-sm">
                        <Link to="/login" className="text-primary-500 hover:text-primary-400 font-semibold">Login</Link> as a Job Seeker to apply.
                    </p>
                )}
            </div>
        </div>
    );
}
