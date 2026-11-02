import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/hooks/useAppState';
import { updateSettings } from '@/db/database';
import { updateChild } from '@/services/profiles';
import { t, localized } from '@/services/i18n';
import { ParentalGate } from '@/components/ParentalGate/ParentalGate';
import { themes, themeIds } from '@/themes/themes';
import type { ThemeId } from '@/types';
import './Settings.css';

export function SettingsScreen() {
  const navigate = useNavigate();
  const { settings, refreshSettings, activeChild } = useApp();
  const [authorized, setAuthorized] = useState(false);

  if (!authorized) {
    return (
      <ParentalGate
        onSuccess={() => setAuthorized(true)}
        onCancel={() => navigate(-1)}
      />
    );
  }

  if (!settings) return null;

  const handleScreenTime = async (value: number) => {
    await updateSettings({ screenTimeLimitMinutes: value });
    refreshSettings();
  };

  const handleAudioSpeed = async (value: 'slow' | 'normal' | 'fast') => {
    await updateSettings({ audioSpeed: value });
    refreshSettings();
  };

  const handleDarkMode = async () => {
    const next = !settings.darkMode;
    await updateSettings({ darkMode: next });
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    refreshSettings();
  };

  const handleSoundEffects = async () => {
    await updateSettings({ soundEffects: !settings.soundEffects });
    refreshSettings();
  };

  const screenTimeOptions = [0, 15, 30, 45, 60];

  return (
    <div className="screen settings">
      <header className="settings__header">
        <button onClick={() => navigate(-1)}>← </button>
        <h1>{t('parents.title')}</h1>
      </header>

      {activeChild && (
        <div className="settings__child">
          🧒 {activeChild.name} ({activeChild.age})
        </div>
      )}

      <section className="settings__section">
        <label className="settings__label">{t('parents.screenTime')}</label>
        <div className="settings__options-row">
          {screenTimeOptions.map((mins) => (
            <button
              key={mins}
              className={`settings__option ${settings.screenTimeLimitMinutes === mins ? 'settings__option--active' : ''}`}
              onClick={() => handleScreenTime(mins)}
            >
              {mins === 0 ? t('settings.unlimited') : t('settings.minutes', { n: mins })}
            </button>
          ))}
        </div>
      </section>

      <section className="settings__section">
        <label className="settings__label">{t('parents.audioSpeed')}</label>
        <div className="settings__options-row">
          {(['slow', 'normal', 'fast'] as const).map((speed) => (
            <button
              key={speed}
              className={`settings__option ${settings.audioSpeed === speed ? 'settings__option--active' : ''}`}
              onClick={() => handleAudioSpeed(speed)}
            >
              {t(`settings.${speed}`)}
            </button>
          ))}
        </div>
      </section>

      <section className="settings__section">
        <button className="settings__toggle" onClick={handleDarkMode}>
          <span>{t('parents.darkMode')}</span>
          <span className={`settings__switch ${settings.darkMode ? 'settings__switch--on' : ''}`}>
            {settings.darkMode ? 'ON' : 'OFF'}
          </span>
        </button>
      </section>

      <section className="settings__section">
        <button className="settings__toggle" onClick={handleSoundEffects}>
          <span>{t('parents.soundEffects')}</span>
          <span className={`settings__switch ${settings.soundEffects ? 'settings__switch--on' : ''}`}>
            {settings.soundEffects ? 'ON' : 'OFF'}
          </span>
        </button>
      </section>

      {activeChild && (
        <section className="settings__section">
          <label className="settings__label">{t('settings.theme')}</label>
          <div className="settings__theme-grid">
            {themeIds.map((id) => {
              const th = themes[id];
              const isActive = activeChild.themeId === id;
              return (
                <button
                  key={id}
                  className={`settings__theme-btn ${isActive ? 'settings__theme-btn--active' : ''}`}
                  style={{
                    background: `linear-gradient(135deg, ${th.colors.gradientStart}, ${th.colors.gradientEnd})`,
                    color: th.colors.textOnGradient,
                  }}
                  onClick={async () => {
                    await updateChild(activeChild.id, { themeId: id as ThemeId });
                    activeChild.themeId = id as ThemeId;
                    refreshSettings();
                  }}
                >
                  <span style={{ fontSize: 24 }}>{th.mascot.emoji}</span>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>{localized(th.name)}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <button
        className="settings__btn-progress"
        onClick={() => navigate('/progress')}
      >
        📊 {t('parents.weeklyReport')}
      </button>
    </div>
  );
}
