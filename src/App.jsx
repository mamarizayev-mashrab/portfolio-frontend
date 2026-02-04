/**
 * Main App Component
 * Routing and layout configuration
 */

import { Routes, Route, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ToastProvider } from './components/common/Toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import { PageLoading } from './components/common/Loading';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './utils/ProtectedRoute';
import Sidebar from './components/admin/Sidebar';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Admin pages
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProjectsManager = lazy(() => import('./pages/admin/ProjectsManager'));
const SkillsManager = lazy(() => import('./pages/admin/SkillsManager'));
const ExperienceManager = lazy(() => import('./pages/admin/ExperienceManager'));
const MessagesViewer = lazy(() => import('./pages/admin/MessagesViewer'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));

// Public layout with navbar and footer
const PublicLayout = () => (
    <div className="min-h-screen flex flex-col bg-dark-950 noise">
        <Navbar />
        <div className="flex-1">
            <Outlet />
        </div>
        <Footer />
    </div>
);

// Admin layout with sidebar
const AdminLayout = () => (
    <div className="min-h-screen bg-dark-950">
        <Sidebar />
        <main className="ml-64 p-8">
            <Outlet />
        </main>
    </div>
);

function App() {
    return (
        <ErrorBoundary>
            <ToastProvider>
                <Suspense fallback={<PageLoading />}>
                    <Routes>
                        {/* Public Routes */}
                        <Route element={<PublicLayout />}>
                            <Route path="/" element={<Home />} />
                        </Route>

                        {/* Admin Login (no sidebar) */}
                        <Route path="/admin/login" element={<Login />} />

                        {/* Protected Admin Routes */}
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute>
                                    <AdminLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<Dashboard />} />
                            <Route path="projects" element={<ProjectsManager />} />
                            <Route path="skills" element={<SkillsManager />} />
                            <Route path="experience" element={<ExperienceManager />} />
                            <Route path="messages" element={<MessagesViewer />} />
                            <Route path="settings" element={<SettingsPage />} />
                        </Route>

                        {/* 404 */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </ToastProvider>
        </ErrorBoundary>
    );
}

export default App;
