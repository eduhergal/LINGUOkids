import { describe, it, expect } from 'vitest';
import { t, localized, setLocale, getLocale } from './i18n';

describe('i18n', () => {
  it('defaults to Spanish', () => {
    setLocale('es');
    expect(getLocale()).toBe('es');
    expect(t('nav.home')).toBe('Inicio');
  });

  it('switches to English', () => {
    setLocale('en');
    expect(t('nav.home')).toBe('Home');
  });

  it('replaces template params', () => {
    setLocale('en');
    expect(t('onboarding.childAge', { name: 'Ana' })).toBe('How old is Ana?');
  });

  it('falls back to key for unknown strings', () => {
    expect(t('nonexistent.key')).toBe('nonexistent.key');
  });

  it('localizes I18nString', () => {
    setLocale('es');
    expect(localized({ en: 'Hello', es: 'Hola' })).toBe('Hola');
    setLocale('en');
    expect(localized({ en: 'Hello', es: 'Hola' })).toBe('Hello');
  });
});
