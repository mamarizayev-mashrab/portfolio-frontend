import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Suspense, lazy, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import { PageLoading } from './components/common/Loading';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './utils/ProtectedRoute';
import Sidebar from './components/admin/Sidebar';

// Helper to handle dynamic import errors (e.g. 404 after new deploy)
const lazyWithRetry = (componentImport) =>
    lazy(async () => {
        try {
            return await componentImport();
        } catch (error) {
            // Check if it's a chunk load error
            if (error.name === 'ChunkLoadError' || error.message.includes('Failed to fetch dynamically imported module')) {
                console.warn('Chunk load failed. Refreshing page...');
                window.location.reload();
            }
            throw error;
        }
    });

// Pages
const Home = lazyWithRetry(() => import('./pages/Home'));
const NotFound = lazyWithRetry(() => import('./pages/NotFound'));
const Login = lazyWithRetry(() => import('./pages/admin/Login'));
const Dashboard = lazyWithRetry(() => import('./pages/admin/Dashboard'));
const ProjectsManager = lazyWithRetry(() => import('./pages/admin/ProjectsManager'));
const SkillsManager = lazyWithRetry(() => import('./pages/admin/SkillsManager'));
const ExperienceManager = lazyWithRetry(() => import('./pages/admin/ExperienceManager'));
const MessagesViewer = lazyWithRetry(() => import('./pages/admin/MessagesViewer'));
const SettingsPage = lazyWithRetry(() => import('./pages/admin/SettingsPage'));
const ArticlesPage = lazyWithRetry(() => import('./pages/ArticlesPage'));
const ArticlesManager = lazyWithRetry(() => import('./pages/admin/ArticlesManager'));

// Public layout
const PublicLayout = () => (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
        <Navbar />
        <main className="flex-1">
            <Outlet />
        </main>
        <Footer />
        <Toaster position="bottom-right" toastOptions={{
            style: {
                background: 'var(--background)',
                color: 'var(--foreground)',
                border: '1px solid var(--accents-2)',
                fontSize: '14px',
                borderRadius: '8px'
            }
        }} />
    </div>
);

// Admin layout
const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Mobile Header with Hamburger */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--background)] border-b border-[var(--accents-2)] z-30 flex items-center justify-between px-4">
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 text-[var(--foreground)]"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12h18M3 6h18M3 18h18" />
                    </svg>
                </button>
                <span className="font-bold tracking-tighter text-sm uppercase">Admin</span>
                <div className="w-10" /> {/* Spacer for centering */}
            </header>

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content - margin only on desktop */}
            <main className="lg:ml-64 min-h-screen lg:border-l border-[var(--accents-2)] pt-16 lg:pt-0">
                <Outlet />
            </main>

            <Toaster position="top-center" toastOptions={{
                style: {
                    background: 'var(--background)',
                    color: 'var(--foreground)',
                    border: '1px solid var(--accents-2)',
                    fontSize: '14px',
                    borderRadius: '8px'
                }
            }} />
        </div>
    );
};

function App() {
    return (
        <ErrorBoundary>
            <Suspense fallback={<PageLoading />}>
                <Routes>
                    {/* Public Routes */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/articles" element={<ArticlesPage />} />
                    </Route>

                    {/* Admin Auth */}
                    <Route path="/admin/login" element={<Login />} />

                    {/* Admin Panel */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute>
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="projects" element={<ProjectsManager />} />
                        <Route path="skills" element={<SkillsManager />} />
                        <Route path="experience" element={<ExperienceManager />} />
                        <Route path="messages" element={<MessagesViewer />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="articles" element={<ArticlesManager />} />
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </ErrorBoundary>
    );
}

export default App;
