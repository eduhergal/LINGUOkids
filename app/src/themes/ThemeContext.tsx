import { createContext, useContext, useEffect, useMemo } from 'react';
import { themes, type ThemeId, type ThemeDef } from './themes';

interface ThemeState {
  theme: ThemeDef;
  themeId: ThemeId;
}

const ThemeCtx = createContext<ThemeState>({
  theme: themes.forest,
  themeId: 'forest',
});

export function ThemeProvider({ themeId, children }: { themeId: ThemeId; children: React.ReactNode }) {
  const value = useMemo<ThemeState>(() => ({
    theme: themes[themeId],
    themeId,
  }), [themeId]);

  useEffect(() => {
    const root = document.documentElement;
    const t = themes[themeId];
    root.setAttribute('data-kid-theme', themeId);
    root.style.setProperty('--theme-gradient-start', t.colors.gradientStart);
    root.style.setProperty('--theme-gradient-mid', t.colors.gradientMid);
    root.style.setProperty('--theme-gradient-end', t.colors.gradientEnd);
    root.style.setProperty('--theme-primary', t.colors.primary);
    root.style.setProperty('--theme-accent', t.colors.accent);
    root.style.setProperty('--theme-nav-bg', t.colors.navBg);
    root.style.setProperty('--theme-nav-active', t.colors.navActive);
    root.style.setProperty('--theme-card-bg', t.colors.cardBg);
    root.style.setProperty('--theme-text-on-gradient', t.colors.textOnGradient);
    root.style.setProperty('--theme-progress-start', t.colors.progressFillStart);
    root.style.setProperty('--theme-progress-end', t.colors.progressFillEnd);
    root.style.setProperty('--theme-letter-color', t.colors.letterColor);
  }, [themeId]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme(): ThemeState {
  return useContext(ThemeCtx);
}
