import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createChild } from '@/services/profiles';
import { setLocale, t } from '@/services/i18n';
import { useApp } from '@/hooks/useAppState';
import { themes, themeIds } from '@/themes/themes';
import { localized } from '@/services/i18n';
import type { Locale, ThemeId } from '@/types';
import './Onboarding.css';

type Step = 'name' | 'age' | 'locale' | 'theme';

const slideVariants = {
  enter: { opacity: 0, x: 50 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

export function Onboarding() {
  const navigate = useNavigate();
  const { setActiveChild } = useApp();
  const [step, setStep] = useState<Step>('name');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | null>(null);
  const [locale, setLocaleState] = useState<Locale>('es');

  const handleNameNext = () => {
    if (name.trim()) setStep('age');
  };

  const handleAgeSelect = (selectedAge: number) => {
    setAge(selectedAge);
    setStep('locale');
  };

  const handleLocaleSelect = (loc: Locale) => {
    setLocaleState(loc);
    setLocale(loc);
    setStep('theme');
  };

  const handleThemeSelect = async (themeId: ThemeId) => {
    const child = await createChild(name.trim(), age!, locale, undefined, themeId);
    setActiveChild(child);
    navigate('/', { replace: true });
  };

  return (
    <div className="onboarding screen-no-nav">
      <AnimatePresence mode="wait">
        {step === 'name' && (
          <motion.div
            key="name" className="onboarding__step"
            variants={slideVariants} initial="enter" animate="center" exit="exit"
          >
            <div className="onboarding__emoji">🎈</div>
            <h1 className="onboarding__title">{t('onboarding.childName')}</h1>
            <input
              className="onboarding__input"
              type="text"
              placeholder={t('onboarding.placeholder')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNameNext()}
              autoFocus
            />
            <button
              className="onboarding__btn"
              onClick={handleNameNext}
              disabled={!name.trim()}
            >
              {t('onboarding.next')} →
            </button>
          </motion.div>
        )}

        {step === 'age' && (
          <motion.div
            key="age" className="onboarding__step"
            variants={slideVariants} initial="enter" animate="center" exit="exit"
          >
            <div className="onboarding__emoji">🎂</div>
            <h1 className="onboarding__title">
              {t('onboarding.childAge', { name: name.trim() })}
            </h1>
            <div className="onboarding__age-grid">
              {[2, 3, 4, 5, 6, 7, 8].map((a) => (
                <button
                  key={a}
                  className="onboarding__age-btn"
                  onClick={() => handleAgeSelect(a)}
                >
                  {a}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'locale' && (
          <motion.div
            key="locale" className="onboarding__step"
            variants={slideVariants} initial="enter" animate="center" exit="exit"
          >
            <div className="onboarding__emoji">🌍</div>
            <h1 className="onboarding__title">{t('onboarding.childLocale')}</h1>
            <div className="onboarding__locale-list">
              <button className="onboarding__locale-btn" onClick={() => handleLocaleSelect('en')}>
                🇬🇧 English
              </button>
              <button className="onboarding__locale-btn" onClick={() => handleLocaleSelect('es')}>
                🇪🇸 Español
              </button>
            </div>
          </motion.div>
        )}

        {step === 'theme' && (
          <motion.div
            key="theme" className="onboarding__step"
            variants={slideVariants} initial="enter" animate="center" exit="exit"
          >
            <div className="onboarding__emoji">✨</div>
            <h1 className="onboarding__title">{t('onboarding.chooseTheme')}</h1>
            <div className="onboarding__theme-list">
              {themeIds.map((id) => {
                const th = themes[id];
                return (
                  <motion.button
                    key={id}
                    className="onboarding__theme-btn"
                    style={{
                      background: `linear-gradient(135deg, ${th.colors.gradientStart}, ${th.colors.gradientEnd})`,
                      color: th.colors.textOnGradient,
                    }}
                    onClick={() => handleThemeSelect(id)}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="onboarding__theme-mascot">{th.mascot.emoji}</span>
                    <span className="onboarding__theme-name">{localized(th.name)}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
