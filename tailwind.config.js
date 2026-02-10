import typography from '@tailwindcss/typography';

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
                // Vercel Brand Palette (Geist)
                background: {
                    light: '#ffffff',
                    dark: '#000000',
                },
                foreground: {
                    light: '#000000',
                    dark: '#ffffff',
                },
                accents: {
                    1: '#111111',
                    2: '#333333',
                    3: '#444444',
                    4: '#666666',
                    5: '#888888',
                    6: '#999999',
                    7: '#eaeaea',
                    8: '#fafafa',
                },
                success: {
                    light: '#0070f3',
                    dark: '#0070f3',
                },
                error: {
                    light: '#ee0000',
                    dark: '#ff0000',
                },
                warning: {
                    light: '#f5a623',
                    dark: '#f5a623',
                },
                primary: 'var(--primary)',
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', '"Fira Sans"', '"Droid Sans"', '"Helvetica Neue"', 'sans-serif'],
                mono: ['Menlo', 'Monaco', 'Lucida Console', 'Liberation Mono', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Courier New', 'monospace'],
            },
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1rem' }],
                sm: ['0.875rem', { lineHeight: '1.25rem' }],
                base: ['1rem', { lineHeight: '1.5rem' }],
                lg: ['1.125rem', { lineHeight: '1.75rem' }],
                xl: ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '1' }],
                '6xl': ['3.75rem', { lineHeight: '1' }],
                '7xl': ['4.5rem', { lineHeight: '1' }],
            },
            letterSpacing: {
                tighter: '-0.05em',
                tight: '-0.02em',
            },
            boxShadow: {
                magical: '0px 0px 30px 10px rgba(0,0,0,0.03)',
                'vercel-input': '0 0 0 1px #333',
                'vercel-hover': '0 0 0 1px #fff',
            }
        },
    },
    plugins: [
        typography,
    ],
}
