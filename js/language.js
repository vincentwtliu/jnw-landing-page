/**
 * JNW Landing Page — Language Module
 * Handles bilingual (zh-TW / en) support with localStorage persistence.
 */

'use strict';

const JNWLanguage = (() => {
  const STORAGE_KEY = 'jnw-lang';
  const DEFAULT_LANG = 'zh-CN';
  const SUPPORTED_LANGS = ['zh-CN', 'en'];

  let currentLang = DEFAULT_LANG;
  let translations = null;

  // Migration: clear old zh-TW preference
  try {
    const old = localStorage.getItem(STORAGE_KEY);
    if (old === 'zh-TW') {
      localStorage.setItem(STORAGE_KEY, 'zh-CN');
    }
  } catch (e) { /* ignore */ }

  /**
   * Get a nested value from an object using a dot-notation key.
   * e.g., getNestedValue(obj, 'philosophy.card1.title')
   */
  function getNestedValue(obj, key) {
    return key.split('.').reduce((acc, part) => {
      return acc && acc[part] !== undefined ? acc[part] : undefined;
    }, obj);
  }

  /**
   * Load the JSON translation file for the given language.
   * Falls back gracefully if fetch fails (keeps existing HTML content).
   */
  async function loadTranslations(lang) {
    try {
      const response = await fetch(`i18n/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load i18n/${lang}.json: ${response.status}`);
      }
      translations = await response.json();
      return true;
    } catch (error) {
      console.warn(`[JNW i18n] Could not load translations for "${lang}". Falling back to existing HTML content.`, error);
      translations = null;
      return false;
    }
  }

  /**
   * Update all DOM elements that have a data-i18n attribute
   * with the corresponding translation string.
   */
  function updateDOM() {
    if (!translations) return;

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const value = getNestedValue(translations, key);
      if (value !== undefined) {
        el.textContent = value;
      }
    });
  }

  /**
   * Update the <html lang> attribute to reflect the current language.
   */
  function updateHtmlLang(lang) {
    document.documentElement.setAttribute('lang', lang);
  }

  /**
   * Update the toggle button label.
   * Shows "EN" when in Chinese mode (click to switch to English).
   * Shows "中" when in English mode (click to switch to Chinese).
   */
  function updateToggleButton() {
    const toggle = document.getElementById('lang-toggle');
    if (!toggle) return;

    if (currentLang === 'zh-CN') {
      toggle.textContent = 'EN';
      toggle.setAttribute('aria-label', 'Switch to English');
    } else {
      toggle.textContent = '中';
      toggle.setAttribute('aria-label', '切换至中文');
    }
  }

  /**
   * Persist the language choice to localStorage.
   */
  function persistLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('[JNW i18n] Could not persist language preference.', e);
    }
  }

  /**
   * Read the stored language preference from localStorage.
   * Returns the default language if none is stored or if the stored value is invalid.
   */
  function getStoredLang() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && SUPPORTED_LANGS.includes(stored)) {
        return stored;
      }
    } catch (e) {
      console.warn('[JNW i18n] Could not read language preference.', e);
    }
    return DEFAULT_LANG;
  }

  /**
   * Switch to the specified language.
   */
  async function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) {
      lang = DEFAULT_LANG;
    }

    currentLang = lang;
    persistLang(lang);
    updateHtmlLang(lang);

    const loaded = await loadTranslations(lang);
    if (loaded) {
      updateDOM();
    }

    updateToggleButton();
  }

  /**
   * Toggle between zh-TW and en.
   */
  function toggle() {
    const nextLang = currentLang === 'zh-CN' ? 'en' : 'zh-CN';
    setLanguage(nextLang);
  }

  /**
   * Initialize the language module.
   * - Reads stored preference (defaults to zh-TW)
   * - Loads translations and updates DOM
   * - Binds toggle button click handler
   */
  async function init() {
    currentLang = getStoredLang();

    // Update html lang attribute immediately
    updateHtmlLang(currentLang);

    // Load translations and update DOM
    await loadTranslations(currentLang);
    if (translations) {
      updateDOM();
    }

    // Bind toggle button
    const toggle = document.getElementById('lang-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        JNWLanguage.toggle();
      });
    }

    updateToggleButton();
  }

  return {
    init,
    setLanguage,
    toggle,
    getCurrentLang: () => currentLang
  };
})();

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  JNWLanguage.init();
});
