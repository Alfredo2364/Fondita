'use client';

import { useThemeStore } from '@/store/themeStore';
import { useLocaleStore } from '@/store/localeStore';
import { useTranslation } from '@/lib/useTranslation';
import { SunIcon, MoonIcon, LanguageIcon } from '@heroicons/react/24/outline';

export default function SettingsPage() {
    const { isDarkMode, toggleTheme } = useThemeStore();
    const { locale, setLocale } = useLocaleStore();
    const { t } = useTranslation();

    return (
        <div className="min-h-screen p-8" style={{ background: 'var(--background)' }}>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--foreground)' }}>
                    {t('settings')}
                </h1>

                {/* Sección de Tema */}
                <div
                    className="rounded-lg p-6 mb-6 shadow-lg"
                    style={{ background: 'var(--card)' }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {isDarkMode ? (
                                <MoonIcon className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                            ) : (
                                <SunIcon className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                            )}
                            <div>
                                <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
                                    {t('theme')}
                                </h2>
                                <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>
                                    {isDarkMode ? t('darkTheme') : t('lightTheme')}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="relative inline-flex h-8 w-14 items-center rounded-full transition-colors"
                            style={{
                                background: isDarkMode ? 'var(--primary)' : 'var(--border)',
                            }}
                        >
                            <span
                                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-7' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Sección de Idioma */}
                <div
                    className="rounded-lg p-6 mb-6 shadow-lg"
                    style={{ background: 'var(--card)' }}
                >
                    <div className="flex items-center gap-4 mb-4">
                        <LanguageIcon className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                        <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
                            {t('language')}
                        </h2>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setLocale('es')}
                            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${locale === 'es' ? 'shadow-md' : 'opacity-60'
                                }`}
                            style={{
                                background: locale === 'es' ? 'var(--primary)' : 'var(--surface)',
                                color: locale === 'es' ? '#FFFFFF' : 'var(--foreground)',
                            }}
                        >
                            🇪🇸 Español
                        </button>
                        <button
                            onClick={() => setLocale('en')}
                            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${locale === 'en' ? 'shadow-md' : 'opacity-60'
                                }`}
                            style={{
                                background: locale === 'en' ? 'var(--primary)' : 'var(--surface)',
                                color: locale === 'en' ? '#FFFFFF' : 'var(--foreground)',
                            }}
                        >
                            🇬🇧 English
                        </button>
                    </div>
                </div>

                {/* Vista Previa de Colores */}
                <div
                    className="rounded-lg p-6 shadow-lg"
                    style={{ background: 'var(--card)' }}
                >
                    <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--foreground)' }}>
                        Color Preview
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <ColorChip label="Primary" color="var(--primary)" />
                        <ColorChip label="Secondary" color="var(--secondary)" />
                        <ColorChip label="Accent" color="var(--accent)" />
                        <ColorChip label="Success" color="var(--success)" />
                        <ColorChip label="Warning" color="var(--warning)" />
                        <ColorChip label="Error" color="var(--error)" />
                        <ColorChip label="Manager" color="var(--manager)" />
                        <ColorChip label="Waiter" color="var(--waiter)" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ColorChip({ label, color }: { label: string; color: string }) {
    return (
        <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'var(--surface)' }}>
            <div
                className="w-8 h-8 rounded-full"
                style={{ background: color }}
            />
            <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                {label}
            </span>
        </div>
    );
}
