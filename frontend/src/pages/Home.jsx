/**
 * Home Page — Themed
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Spinner from '../components/Spinner';
import { FiSearch, FiMapPin, FiCalendar, FiDollarSign, FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';

export default function Home() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [location, setLocation] = useState('');
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (keyword) params.append('keyword', keyword);
            if (location) params.append('location', location);
            if (sort) params.append('sort', sort);
            params.append('page', page);
            params.append('limit', 9);
            const { data } = await API.get(`/jobs?${params.toString()}`);
            setJobs(data.jobs);
            setTotalPages(data.totalPages);
            setTotal(data.total);
        } catch (err) {
            console.error('Failed to load jobs', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchJobs(); }, [page, sort]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchJobs();
    };

    return (
        <div className="min-h-screen">
            {/* ── Hero ──────────────────────────────── */}
            <section className="relative overflow-hidden py-24 md:py-32 px-4">
                <div className="orb orb-indigo w-[500px] h-[500px] -top-40 left-1/4 animate-float" />
                <div className="orb orb-violet w-[400px] h-[400px] top-20 right-10 animate-float-slow" />
                <div className="orb orb-blue w-[300px] h-[300px] bottom-0 left-10 animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 grid-pattern opacity-40" />

                <div className="relative max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 badge-gradient rounded-full px-4 py-1.5 text-xs text-primary-600 dark:text-primary-300 font-medium mb-6 animate-fade-up">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        Thousands of jobs available
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight animate-fade-up" style={{ animationDelay: '100ms' }}>
                        Find Your{' '}
                        <span className="gradient-text-hero">Dream Job</span>
                        <br />
                        <span className="text-gray-700 dark:text-gray-300 text-4xl md:text-5xl font-bold">Build Your Career</span>
                    </h1>

                    <p className="text-gray-500 text-lg md:text-xl mb-12 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '200ms' }}>
                        Connect with top companies, discover opportunities that match your skills, and land your next role.
                    </p>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="glass-card rounded-2xl p-2 flex flex-col md:flex-row gap-2 animate-fade-up" style={{ animationDelay: '300ms' }}>
                        <div className="flex items-center flex-1 rounded-xl px-4 py-3.5 bg-white/30 dark:bg-black/30">
                            <FiSearch className="text-primary-500 mr-3 text-lg flex-shrink-0" />
                            <input type="text" placeholder="Job title or keyword…" value={keyword} onChange={(e) => setKeyword(e.target.value)}
                                className="bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 w-full text-sm" />
                        </div>
                        <div className="flex items-center flex-1 rounded-xl px-4 py-3.5 bg-white/30 dark:bg-black/30">
                            <FiMapPin className="text-accent-500 mr-3 text-lg flex-shrink-0" />
                            <input type="text" placeholder="Location…" value={location} onChange={(e) => setLocation(e.target.value)}
                                className="bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 w-full text-sm" />
                        </div>
                        <button type="submit" className="btn-gradient px-8 py-3.5 rounded-xl font-semibold flex items-center gap-2 justify-center">
                            Search <FiArrowRight />
                        </button>
                    </form>

                    {/* Stats */}
                    <div className="flex justify-center gap-8 mt-10 animate-fade-up" style={{ animationDelay: '400ms' }}>
                        {[
                            { label: 'Active Jobs', value: total || '500+' },
                            { label: 'Companies', value: '200+' },
                            { label: 'Seekers', value: '10K+' },
                        ].map((s) => (
                            <div key={s.label} className="text-center">
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                                <p className="text-xs text-gray-500">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Controls ──────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-gray-500 text-sm">
                    Showing <span className="text-gray-900 dark:text-white font-semibold">{jobs.length}</span> of{' '}
                    <span className="text-gray-900 dark:text-white font-semibold">{total}</span> jobs
                </p>
                <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}
                    className="bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-sm rounded-xl px-4 py-2.5 focus:ring-primary-500 focus:border-primary-500 outline-none cursor-pointer"
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="salary">Highest Salary</option>
                </select>
            </section>

            {/* ── Job Cards ─────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 pb-16">
                {loading ? (
                    <Spinner />
                ) : jobs.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800/50 flex items-center justify-center mx-auto mb-4">
                            <FiSearch className="text-3xl text-gray-400 dark:text-gray-600" />
                        </div>
                        <p className="text-gray-500 text-lg">No jobs found. Try a different search.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
                        {jobs.map((job) => (
                            <Link key={job._id} to={`/job/${job._id}`}
                                className="glass-card glass-card-hover rounded-2xl p-6 group animate-fade-up">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500/80 to-accent-500/80 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/10">
                                        {job.company?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{job.company}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-600">{job.category}</p>
                                    </div>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">{job.title}</h3>
                                <p className="text-gray-500 text-sm mb-5 line-clamp-2 leading-relaxed">{job.description}</p>
                                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                    <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800/40 px-2.5 py-1 rounded-lg">
                                        <FiMapPin className="text-primary-500" /> {job.location}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800/40 px-2.5 py-1 rounded-lg">
                                        <FiDollarSign className="text-emerald-500" /> {job.salary}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800/40 px-2.5 py-1 rounded-lg">
                                        <FiCalendar className="text-accent-500" /> {new Date(job.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="mt-5 pt-4 border-t border-gray-200/50 dark:border-gray-800/50 flex items-center justify-between">
                                    <span className="text-xs text-gray-400 dark:text-gray-600">View Details</span>
                                    <FiArrowRight className="text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                            className="p-2.5 rounded-xl glass text-gray-500 hover:text-primary-500 disabled:opacity-30 transition-all"><FiChevronLeft /></button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button key={i + 1} onClick={() => setPage(i + 1)}
                                className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${page === i + 1 ? 'btn-gradient' : 'glass text-gray-500 hover:text-primary-500'}`}>{i + 1}</button>
                        ))}
                        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                            className="p-2.5 rounded-xl glass text-gray-500 hover:text-primary-500 disabled:opacity-30 transition-all"><FiChevronRight /></button>
                    </div>
                )}
            </section>
        </div>
    );
}
