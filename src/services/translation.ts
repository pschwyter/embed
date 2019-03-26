declare global {
  interface Navigator {
    language?: string;
    languages?: [string];
    userLanguage?: string;
    browserLanguage?: string;
    systemLanguage?: string;
  }
}

export function getBrowserLanguage(): string {
  const DEFAULT_VALUE = "";
  const {
    language,
    languages,
    userLanguage,
    browserLanguage,
    systemLanguage
  } = navigator;

  let BROWSER_LANGUAGE = (
    (languages && languages[0]) ||
    language ||
    userLanguage ||
    browserLanguage ||
    systemLanguage ||
    DEFAULT_VALUE
  );
  // en-US -> en
  BROWSER_LANGUAGE = BROWSER_LANGUAGE.split("-")[0];

  return BROWSER_LANGUAGE;
}
