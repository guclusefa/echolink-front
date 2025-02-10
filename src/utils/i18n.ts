import i18n from '@/services/i18n';

/**
 * Get the current locale
 */
export function getCurrentLocale(): string {
  return i18n.global.locale;
}

/**
 * Get avails locales
 */
export function getAvailableLocales(): Record<string, string> {
  return {
    en: 'English',
    fr: 'Français'
  };
}

/**
 * Set the current locale
 */
export function setLocale(locale: string): void {
  i18n.global.locale = locale;
  localStorage.setItem('locale', locale);
}

/**
 * Translate a key
 * @param key
 * @param params
 */
export function translate(key: string, params?: Record<string, string>): string {
  return i18n.global.t(key, params) as string;
}
