import { useLocaleStore } from '@/store/localeStore';
import { translations, TranslationKey } from './translations';

export function useTranslation() {
    const { locale } = useLocaleStore();

    const t = (key: TranslationKey): string => {
        return translations[locale][key] || key;
    };

    return { t, locale };
}
