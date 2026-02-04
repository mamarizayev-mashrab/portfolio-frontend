/**
 * Loading Components
 * Skeleton loaders and spinner components
 */

// Full page loading spinner
export const PageLoading = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-dark-950 z-50">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-500/20 rounded-full" />
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
        </div>
    </div>
);

// Button loading spinner
export const ButtonSpinner = ({ size = 'sm' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    return (
        <svg
            className={`animate-spin ${sizeClasses[size]}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );
};

// Skeleton text line
export const SkeletonText = ({ width = 'full', height = '4' }) => (
    <div className={`skeleton h-${height} w-${width} rounded`} />
);

// Skeleton card
export const SkeletonCard = () => (
    <div className="card p-6 space-y-4">
        <div className="skeleton h-48 w-full rounded-lg mb-4" />
        <div className="skeleton h-6 w-3/4 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-5/6 rounded" />
        <div className="flex gap-2 pt-2">
            <div className="skeleton h-6 w-16 rounded-full" />
            <div className="skeleton h-6 w-16 rounded-full" />
            <div className="skeleton h-6 w-16 rounded-full" />
        </div>
    </div>
);

// Skeleton project card
export const SkeletonProjectCard = () => (
    <div className="card overflow-hidden">
        <div className="skeleton h-52 w-full" />
        <div className="p-5 space-y-3">
            <div className="skeleton h-6 w-2/3 rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-4/5 rounded" />
            <div className="flex gap-2 pt-1">
                <div className="skeleton h-5 w-14 rounded-full" />
                <div className="skeleton h-5 w-14 rounded-full" />
                <div className="skeleton h-5 w-14 rounded-full" />
            </div>
        </div>
    </div>
);

// Skeleton skill item
export const SkeletonSkillItem = () => (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-dark-800/30">
        <div className="skeleton w-10 h-10 rounded-lg" />
        <div className="flex-1">
            <div className="skeleton h-4 w-20 rounded mb-2" />
            <div className="skeleton h-2 w-full rounded-full" />
        </div>
    </div>
);

// Skeleton experience item
export const SkeletonExperienceItem = () => (
    <div className="flex gap-4 pb-8 border-l-2 border-dark-700 pl-6 ml-2 relative">
        <div className="absolute -left-2 top-0 w-4 h-4 rounded-full skeleton" />
        <div className="flex-1 space-y-2">
            <div className="skeleton h-5 w-1/3 rounded" />
            <div className="skeleton h-6 w-1/2 rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-4/5 rounded" />
        </div>
    </div>
);

// Loading overlay
export const LoadingOverlay = ({ message = 'Loading...' }) => (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-950/80 backdrop-blur-sm z-10">
        <div className="relative mb-4">
            <div className="w-12 h-12 border-4 border-primary-500/20 rounded-full" />
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
        </div>
        <p className="text-dark-300 text-sm">{message}</p>
    </div>
);

export default {
    PageLoading,
    ButtonSpinner,
    SkeletonText,
    SkeletonCard,
    SkeletonProjectCard,
    SkeletonSkillItem,
    SkeletonExperienceItem,
    LoadingOverlay
};
