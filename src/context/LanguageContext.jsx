/**
 * Language Context
 * Manages i18n with 3 languages (UZ, EN, RU) and localStorage persistence
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Import translations
import uzTranslations from '../i18n/uz.json';
import enTranslations from '../i18n/en.json';
import ruTranslations from '../i18n/ru.json';

const LanguageContext = createContext();

// Available languages
export const LANGUAGES = {
    uz: { code: 'uz', name: "O'zbekcha", flag: '🇺🇿' },
    en: { code: 'en', name: 'English', flag: '🇺🇸' },
    ru: { code: 'ru', name: 'Русский', flag: '🇷🇺' }
};

// Translations map
const translations = {
    uz: uzTranslations,
    en: enTranslations,
    ru: ruTranslations
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    // Initialize language from localStorage or default to 'uz'
    const [language, setLanguage] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedLang = localStorage.getItem('portfolio-language');
            return savedLang && LANGUAGES[savedLang] ? savedLang : 'uz';
        }
        return 'uz';
    });

    // Dynamic translations from backend settings (can override static)
    const [dynamicTranslations, setDynamicTranslations] = useState({});

    // Save language to localStorage when it changes
    useEffect(() => {
        localStorage.setItem('portfolio-language', language);
        document.documentElement.lang = language;
    }, [language]);

    // Change language
    const changeLanguage = (lang) => {
        if (LANGUAGES[lang]) {
            setLanguage(lang);
        }
    };

    // Update dynamic translations (from backend settings)
    const updateDynamicTranslations = (settings) => {
        setDynamicTranslations(settings);
    };

    /**
     * Get translation by key path (e.g., 'nav.home', 'hero.title')
     * Supports nested object paths
     */
    const t = useCallback((keyPath, fallback = '') => {
        const keys = keyPath.split('.');

        // First try dynamic translations
        let dynamicValue = dynamicTranslations;
        for (const key of keys) {
            if (dynamicValue && typeof dynamicValue === 'object' && key in dynamicValue) {
                dynamicValue = dynamicValue[key];
            } else {
                dynamicValue = undefined;
                break;
            }
        }

        // If dynamic translation exists and has language-specific value
        if (dynamicValue !== undefined) {
            if (typeof dynamicValue === 'object' && language in dynamicValue) {
                return dynamicValue[language];
            }
            if (typeof dynamicValue === 'string') {
                return dynamicValue;
            }
        }

        // Fall back to static translations
        let staticValue = translations[language];
        for (const key of keys) {
            if (staticValue && typeof staticValue === 'object' && key in staticValue) {
                staticValue = staticValue[key];
            } else {
                return fallback || keyPath;
            }
        }

        return staticValue || fallback || keyPath;
    }, [language, dynamicTranslations]);

    /**
     * Get localized field from i18n object (e.g., { uz: '...', en: '...', ru: '...' })
     */
    const getLocalizedField = useCallback((obj, field) => {
        if (!obj) return '';

        const fieldValue = field ? obj[field] : obj;

        if (typeof fieldValue === 'string') return fieldValue;

        if (typeof fieldValue === 'object') {
            return fieldValue[language] || fieldValue.en || fieldValue.uz || '';
        }

        return '';
    }, [language]);

    const value = {
        language,
        languages: LANGUAGES,
        changeLanguage,
        t,
        getLocalizedField,
        updateDynamicTranslations,
        currentLanguage: LANGUAGES[language]
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageContext;
