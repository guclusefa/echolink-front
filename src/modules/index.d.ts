declare module 'vue-i18n' {
  export function createI18n(options: {
    locale: string;
    fallbackLocale: string;
    messages: Record<string, Record<string, string>>;
  }): any;
}
