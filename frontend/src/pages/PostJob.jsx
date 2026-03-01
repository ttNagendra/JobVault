/**
 * Post Job — Themed
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';
import { FiPlusCircle, FiArrowRight } from 'react-icons/fi';

export default function PostJob() {
    const [form, setForm] = useState({ title: '', description: '', company: '', location: '', salary: '', category: '' });
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            await API.post('/jobs', form);
            toast.success('Job posted successfully!');
            navigate('/dashboard/recruiter');
        } catch (err) { toast.error(err.response?.data?.message || 'Failed to post job'); }
        finally { setSubmitting(false); }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 relative">
            <div className="orb orb-violet w-[300px] h-[300px] -top-20 -right-20 animate-float-slow" />

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3 animate-fade-up">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                    <FiPlusCircle className="text-white text-lg" />
                </div>
                Post a New Job
            </h1>

            <div className="glass-card rounded-3xl p-8 relative animate-fade-up" style={{ animationDelay: '100ms' }}>
                <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-primary-500/40 to-transparent" />
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="text-xs text-gray-500 mb-1.5 block font-medium uppercase tracking-wider">Job Title *</label>
                        <input name="title" required placeholder="e.g. Senior React Developer" value={form.title} onChange={handleChange} className="input-glass input-glass-plain w-full" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1.5 block font-medium uppercase tracking-wider">Company *</label>
                        <input name="company" required placeholder="e.g. Google" value={form.company} onChange={handleChange} className="input-glass input-glass-plain w-full" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 mb-1.5 block font-medium uppercase tracking-wider">Location *</label>
                            <input name="location" required placeholder="e.g. Bangalore" value={form.location} onChange={handleChange} className="input-glass input-glass-plain w-full" />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1.5 block font-medium uppercase tracking-wider">Salary</label>
                            <input name="salary" placeholder="e.g. ₹12-18 LPA" value={form.salary} onChange={handleChange} className="input-glass input-glass-plain w-full" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1.5 block font-medium uppercase tracking-wider">Category</label>
                        <input name="category" placeholder="e.g. Engineering" value={form.category} onChange={handleChange} className="input-glass input-glass-plain w-full" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 mb-1.5 block font-medium uppercase tracking-wider">Description *</label>
                        <textarea name="description" required rows={6} placeholder="Describe the role…"
                            value={form.description} onChange={handleChange}
                            className="input-glass input-glass-plain w-full resize-none" />
                    </div>
                    <button type="submit" disabled={submitting}
                        className="w-full btn-gradient disabled:opacity-50 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2">
                        {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Post Job <FiArrowRight /></>}
                    </button>
                </form>
            </div>
        </div>
    );
}
