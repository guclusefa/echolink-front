import { getAppName } from './app';
import { translate } from './i18n';

/**
 * Set the document title
 * @param title
 */
export function setDocumentTitle(title: string): void {
  const translation: string = translate(`routes.${title}`);
  const prefix: string = translation != `routes.${title}` ? translation : title;
  document.title = `${prefix} | ${getAppName()}`;
}

/**
 * Set the document lang with the current locale
 * @param locale
 */
export function setDocumentLang(locale: string): void {
  document.documentElement.lang = locale;
}
