/**
 * App Component — Root with premium toast styling
 */

import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobDetails from './pages/JobDetails';
import PostJob from './pages/PostJob';
import MyApplications from './pages/MyApplications';
import RecruiterDashboard from './pages/RecruiterDashboard';
import SeekerDashboard from './pages/SeekerDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
    return (
        <div className="flex flex-col min-h-screen">
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: 'rgba(15, 23, 42, 0.9)',
                        backdropFilter: 'blur(20px)',
                        color: '#e2e8f0',
                        border: '1px solid rgba(148, 163, 184, 0.1)',
                        borderRadius: '14px',
                        padding: '14px 18px',
                        fontSize: '14px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    },
                    success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
                    error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                }}
            />

            <Navbar />

            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/job/:id" element={<JobDetails />} />

                    <Route element={<ProtectedRoute allowedRoles={['seeker']} />}>
                        <Route path="/my-applications" element={<MyApplications />} />
                        <Route path="/dashboard/seeker" element={<SeekerDashboard />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
                        <Route path="/post-job" element={<PostJob />} />
                        <Route path="/dashboard/recruiter" element={<RecruiterDashboard />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/dashboard/admin" element={<AdminDashboard />} />
                    </Route>

                    <Route path="*" element={
                        <div className="flex items-center justify-center min-h-[60vh] relative">
                            <div className="orb orb-indigo w-[300px] h-[300px] animate-float" />
                            <div className="text-center relative">
                                <h2 className="text-7xl font-extrabold gradient-text mb-4">404</h2>
                                <p className="text-gray-500 text-lg">Page not found</p>
                            </div>
                        </div>
                    } />
                </Routes>
            </main>

            <Footer />
        </div>
    );
}
