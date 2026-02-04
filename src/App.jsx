import { Routes, Route, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import { PageLoading } from './components/common/Loading';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './utils/ProtectedRoute';
import Sidebar from './components/admin/Sidebar';

// Pages
const Home = lazy(() => import('./pages/Home'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProjectsManager = lazy(() => import('./pages/admin/ProjectsManager'));
const SkillsManager = lazy(() => import('./pages/admin/SkillsManager'));
const ExperienceManager = lazy(() => import('./pages/admin/ExperienceManager'));
const MessagesViewer = lazy(() => import('./pages/admin/MessagesViewer'));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));

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
const AdminLayout = () => (
    <div className="min-h-screen bg-[var(--background)]">
        <Sidebar />
        <main className="ml-64 min-h-screen border-l border-[var(--accents-2)]">
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

function App() {
    return (
        <ErrorBoundary>
            <Suspense fallback={<PageLoading />}>
                <Routes>
                    {/* Public Routes */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Home />} />
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
        </ErrorBoundary>
    );
}

export default App;
