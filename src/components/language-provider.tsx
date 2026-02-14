"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import ar from '../dictionaries/ar.json';
import en from '../dictionaries/en.json';

type Locale = 'ar' | 'en';
type Dictionary = typeof ar;

interface LanguageContextType {
    locale: Locale;
    t: Dictionary;
    setLocale: (locale: Locale) => void;
    isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [locale, setLocaleState] = useState<Locale>('ar');

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale') as Locale;
        if (savedLocale && (savedLocale === 'ar' || savedLocale === 'en')) {
            setLocaleState(savedLocale);
        }
    }, []);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem('locale', newLocale);
        document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = newLocale;
    };

    useEffect(() => {
        document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = locale;
    }, [locale]);

    const t = locale === 'ar' ? ar : en;
    const isRTL = locale === 'ar';

    return (
        <LanguageContext.Provider value={{ locale, t, setLocale, isRTL }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
