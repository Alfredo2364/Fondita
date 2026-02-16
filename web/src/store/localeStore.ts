import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Locale = 'es' | 'en';

interface LocaleStore {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    toggleLocale: () => void;
}

export const useLocaleStore = create<LocaleStore>()(
    persist(
        (set) => ({
            locale: 'es',
            setLocale: (locale) => set({ locale }),
            toggleLocale: () =>
                set((state) => ({ locale: state.locale === 'es' ? 'en' : 'es' })),
        }),
        {
            name: 'fondita-locale-storage',
        }
    )
);
