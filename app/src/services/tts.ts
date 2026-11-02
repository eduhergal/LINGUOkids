import type { Locale } from '@/types';

const LETTER_PHONETICS: Record<Locale, Record<string, string>> = {
  en: {
    A: 'ay', B: 'bee', C: 'see', D: 'dee', E: 'ee', F: 'eff', G: 'jee',
    H: 'aitch', I: 'eye', J: 'jay', K: 'kay', L: 'ell', M: 'em',
    N: 'en', O: 'oh', P: 'pee', Q: 'kew', R: 'ar', S: 'ess',
    T: 'tee', U: 'you', V: 'vee', W: 'double you', X: 'ex', Y: 'why', Z: 'zee',
  },
  es: {
    A: 'a', B: 'be', C: 'ce', D: 'de', E: 'e', F: 'efe', G: 'je',
    H: 'ache', I: 'i', J: 'jota', K: 'ka', L: 'ele', M: 'eme',
    N: 'ene', O: 'o', P: 'pe', Q: 'cu', R: 'erre', S: 'ese',
    T: 'te', U: 'u', V: 'uve', W: 'uve doble', X: 'equis', Y: 'i griega', Z: 'zeta',
  },
};

const LANG_TAG: Record<Locale, string> = { en: 'en-US', es: 'es-ES' };

const PREFERRED_VOICES: Record<Locale, string[]> = {
  es: ['Paulina', 'Monica', 'Luciana', 'Jorge', 'es-ES', 'es-MX', 'es_'],
  en: ['Samantha', 'Karen', 'Moira', 'Daniel', 'en-US', 'en-GB', 'en_'],
};

let cachedVoices: Record<string, SpeechSynthesisVoice | null> = {};

function pickVoice(locale: Locale): SpeechSynthesisVoice | null {
  const cacheKey = locale;
  if (cachedVoices[cacheKey] !== undefined) return cachedVoices[cacheKey];

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) {
    cachedVoices[cacheKey] = null;
    return null;
  }

  const prefs = PREFERRED_VOICES[locale];
  for (const pref of prefs) {
    const match = voices.find(
      (v) => v.name.includes(pref) || v.lang.includes(pref),
    );
    if (match) {
      cachedVoices[cacheKey] = match;
      return match;
    }
  }

  const langTag = LANG_TAG[locale];
  const fallback = voices.find((v) => v.lang.startsWith(langTag.slice(0, 2))) ?? null;
  cachedVoices[cacheKey] = fallback;
  return fallback;
}

export function isTTSAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function cancelSpeech(): void {
  if (isTTSAvailable()) {
    window.speechSynthesis.cancel();
  }
}

export function speak(
  text: string,
  locale: Locale,
  rate = 0.9,
  pitch = 1.1,
): Promise<void> {
  return new Promise<void>((resolve) => {
    if (!isTTSAvailable() || !text) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = LANG_TAG[locale];
    utter.rate = rate;
    utter.pitch = pitch;

    const voice = pickVoice(locale);
    if (voice) utter.voice = voice;

    utter.onend = () => resolve();
    utter.onerror = () => resolve();

    window.speechSynthesis.speak(utter);

    // Safari sometimes pauses indefinitely; force-resume after a tick
    setTimeout(() => {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
    }, 200);
  });
}

export function speakLetter(letter: string, locale: Locale): Promise<void> {
  const upper = letter.toUpperCase();
  const phonetic = LETTER_PHONETICS[locale]?.[upper] ?? letter;
  return speak(phonetic, locale, 0.8, 1.15);
}

export function speakNumber(num: number, locale: Locale): Promise<void> {
  return speak(String(num), locale, 0.8, 1.1);
}

export function speakWord(word: string, locale: Locale): Promise<void> {
  return speak(word, locale, 0.85, 1.1);
}

export function speakInstruction(text: string, locale: Locale): Promise<void> {
  return speak(text, locale, 0.75, 1.05);
}

// Pre-load voices (Safari populates them asynchronously)
if (isTTSAvailable()) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener?.('voiceschanged', () => {
    cachedVoices = {};
  });
}
