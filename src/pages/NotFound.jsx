/**
 * 404 Not Found Page Component
 */

import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';

const NotFound = () => {
    const { t } = useLanguage();

    return (
        <>
            <Helmet>
                <title>404 - Page Not Found</title>
            </Helmet>

            <main className="min-h-screen flex items-center justify-center px-4">
                {/* Background */}
                <div className="absolute inset-0 bg-grid opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/50 to-dark-950" />

                {/* Content */}
                <div className="relative z-10 text-center max-w-lg">
                    {/* 404 Text */}
                    <h1 className="text-[150px] md:text-[200px] font-bold text-gradient leading-none mb-4">
                        404
                    </h1>

                    {/* Glitch effect lines */}
                    <div className="absolute top-1/4 left-0 right-0 h-1 bg-primary-500/30 animate-pulse" />
                    <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-accent-500/20 animate-pulse delay-100" />

                    {/* Message */}
                    <h2 className="text-2xl md:text-3xl font-bold text-dark-100 mb-4">
                        {t('notFound.subtitle')}
                    </h2>
                    <p className="text-dark-400 mb-8">
                        {t('notFound.description')}
                    </p>

                    {/* Back button */}
                    <Link
                        to="/"
                        className="btn-primary inline-flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        {t('notFound.backHome')}
                    </Link>
                </div>
            </main>
        </>
    );
};

export default NotFound;
