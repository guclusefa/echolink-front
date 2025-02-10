import { createI18n } from 'vue-i18n';

function getLocaleMessages(): Record<string, Record<string, string>> {
  const messages: Record<string, Record<string, string>> = {};
  const locales: Record<string, Record<string, string>> = import.meta.glob('@/locales/*/*.json', {
    eager: true
  });
  // Get the path of each file in the locales folder
  for (const path in locales) {
    const matched = path.match(/([A-Za-z0-9-_]+)\.json$/);
    if (matched && matched.length > 1) {
      const key = matched[1];
      // Create a new object for the locale if it doesn't exist
      if (!messages[key]) {
        messages[key] = {};
      }
      // Merge the contents of the file with the existing messages
      messages[key] = { ...messages[key], ...locales[path] };
    }
  }
  return messages;
}

const i18n = createI18n({
  locale: localStorage.getItem('locale') || import.meta.env.VITE_APP_I18N_LOCALE || 'en',
  fallbackLocale: import.meta.env.VITE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: getLocaleMessages()
});

export default i18n;
