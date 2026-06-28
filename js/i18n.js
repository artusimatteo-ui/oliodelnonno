const SUPPORTED_LANGS = ['en', 'it', 'de'];
const STORAGE_KEY = 'oliveoil_lang';
const STORAGE_TTL_MS = 1000 * 60 * 60 * 24 * 30;

const waitForDom = () =>
  new Promise((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve, { once: true });
    } else {
      resolve();
    }
  });

const normalizeLang = (lang) => {
  if (!lang) {
    return null;
  }
  const base = lang.toLowerCase().split('-')[0];
  return SUPPORTED_LANGS.includes(base) ? base : null;
};

const loadStoredLang = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const data = JSON.parse(raw);
    if (!data || !data.lang || !data.expiresAt) {
      return null;
    }
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data.lang;
  } catch (error) {
    return null;
  }
};

const storeLang = (lang) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        lang,
        expiresAt: Date.now() + STORAGE_TTL_MS
      })
    );
  } catch (error) {
  }
};

const detectLang = () => {
  const stored = loadStoredLang();
  if (stored) {
    return stored;
  }
  const browser =
    normalizeLang((navigator.languages && navigator.languages[0]) || navigator.language) || 'en';
  return browser;
};

const loadMessages = async (lang) => {
  try {
    const messages = await import(`../locales/${lang}/common.json`);
    return messages.default || messages;
  } catch (error) {
    if (lang !== 'en') {
      return loadMessages('en');
    }
    throw error;
  }
};

const applyTranslations = (messages) => {
  const elements = document.querySelectorAll('[data-i18n], [data-i18n-attr]');
  elements.forEach((element) => {
    const key = element.getAttribute('data-i18n');
    if (key) {
      const value = messages[key];
      if (typeof value === 'string') {
        element.textContent = value;
      }
    }

    const attrSpec = element.getAttribute('data-i18n-attr');
    if (attrSpec) {
      attrSpec.split(',').forEach((pair) => {
        const [attrName, attrKey] = pair.split(':').map((item) => item && item.trim());
        if (!attrName || !attrKey) {
          return;
        }
        const value = messages[attrKey];
        if (typeof value === 'string') {
          element.setAttribute(attrName, value);
        }
      });
    }
  });
};

const syncLangSelect = (lang) => {
  const select = document.querySelector('[data-lang-select]');
  if (select && select.value !== lang) {
    select.value = lang;
  }
};

const bindLanguagePicker = () => {
  const select = document.querySelector('[data-lang-select]');
  if (!select) {
    return;
  }
  select.addEventListener('change', (event) => {
    setLanguage(event.target.value);
  });
};

export const setLanguage = async (lang) => {
  const normalized = normalizeLang(lang) || 'en';
  await waitForDom();
  const messages = await loadMessages(normalized);
  applyTranslations(messages);
  document.documentElement.lang = normalized;
  storeLang(normalized);
  syncLangSelect(normalized);
  return normalized;
};

export const initI18n = async () => {
  const lang = detectLang();
  await setLanguage(lang);
  bindLanguagePicker();
  window.setLanguage = setLanguage;
};
