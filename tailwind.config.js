/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Vercel-style true black and white
                background: '#0a0a0a',
                foreground: '#ededed',
                // Neon Accents
                primary: {
                    DEFAULT: '#a855f7', // Neon Purple
                    hover: '#9333ea',
                },
                accent: {
                    DEFAULT: '#06b6d4', // Cyan
                    hover: '#0891b2',
                    red: '#ef4444', // Soft Red
                },
                // Vercel Grays
                dark: {
                    100: '#fafafa',
                    200: '#eaeaea',
                    300: '#999999',
                    400: '#888888',
                    500: '#666666',
                    600: '#444444',
                    700: '#333333',
                    800: '#111111',
                    900: '#000000',
                }
            },
            fontFamily: {
                // Vercel uses Geist or Inter for sans, and monospace for tech feel
                mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif', 'Outfit'],
            },
            boxShadow: {
                // Vercel's subtle shadow + Manga's sharp offset shadow
                'vercel': '0 0 0 1px rgba(255, 255, 255, 0.1), 0 8px 30px rgba(0, 0, 0, 0.5)',
                'manga': '6px 6px 0px 0px rgba(255, 255, 255, 0.05)',
                'manga-hover': '0 0 0 1px rgba(168, 85, 247, 0.4), 8px 8px 0px 0px rgba(168, 85, 247, 0.1)',
                'glow-purple': '0 0 20px rgba(168, 85, 247, 0.3)',
                'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'reveal': 'reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'border-draw': 'border-draw 0.5s ease-out forwards',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                reveal: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'border-draw': {
                    '0%': { width: '0%', height: '0%' },
                    '100%': { width: '100%', height: '100%' },
                }
            },
            backgroundImage: {
                'vercel-grid': 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
            }
        },
    },
    plugins: [],
}
