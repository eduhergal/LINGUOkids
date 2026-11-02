import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from '@/hooks/useAppState';
import { ThemeProvider } from '@/themes/ThemeContext';
import { getSettings } from '@/db/database';
import { getChildren } from '@/services/profiles';
import { setLocale } from '@/services/i18n';
import { startSession, isScreenTimeLimitReached } from '@/services/screenTime';
import { setAudioSpeed } from '@/services/audio';
import { BottomNav } from '@/components/BottomNav/BottomNav';
import { ScreenTimeModal } from '@/components/ScreenTimeModal/ScreenTimeModal';
import { Onboarding } from '@/screens/Onboarding/Onboarding';
import { ChildSelect } from '@/screens/ChildSelect/ChildSelect';
import type { Child, Settings, ThemeId } from '@/types';

const Home = lazy(() => import('@/screens/Home/Home').then((m) => ({ default: m.Home })));
const Lessons = lazy(() => import('@/screens/Lessons/Lessons').then((m) => ({ default: m.Lessons })));
const Favorites = lazy(() => import('@/screens/Favorites/Favorites').then((m) => ({ default: m.Favorites })));
const Progress = lazy(() => import('@/screens/Progress/Progress').then((m) => ({ default: m.Progress })));
const SettingsScreen = lazy(() => import('@/screens/Settings/Settings').then((m) => ({ default: m.SettingsScreen })));
const Activity = lazy(() => import('@/screens/Activity/Activity').then((m) => ({ default: m.Activity })));

function Loading() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', fontSize: 48 }}>
      🎈
    </div>
  );
}

function AppContent() {
  const [activeChild, setActiveChildRaw] = useState<Child | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [hasMultipleChildren, setHasMultipleChildren] = useState(false);
  const [screenTimeLimitHit, setScreenTimeLimitHit] = useState(false);

  const setActiveChild = useCallback((child: Child | null) => {
    setActiveChildRaw(child);
    if (child) setNeedsOnboarding(false);
  }, []);

  const refreshSettings = useCallback(async () => {
    const s = await getSettings();
    setSettings(s);
    setLocale(s.locale);
    setAudioSpeed(s.audioSpeed);
    if (s.darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, []);

  useEffect(() => {
    async function init() {
      await refreshSettings();
      const children = await getChildren();
      if (children.length === 0) {
        setNeedsOnboarding(true);
      } else if (children.length === 1) {
        setActiveChildRaw(children[0]);
        setLocale(children[0].locale);
      } else {
        setHasMultipleChildren(true);
      }
      startSession();
      setLoading(false);
    }
    init();
  }, [refreshSettings]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (await isScreenTimeLimitReached()) {
        setScreenTimeLimitHit(true);
      }
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <Loading />;
  }

  const themeId: ThemeId = activeChild?.themeId ?? settings?.defaultThemeId ?? 'forest';

  return (
    <AppContext.Provider value={{ activeChild, setActiveChild, settings, refreshSettings }}>
      <ThemeProvider themeId={themeId}>
        <BrowserRouter>
          {screenTimeLimitHit && <ScreenTimeModal />}
          <main className="app-main">
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/children" element={<ChildSelect />} />
                <Route path="/activity/:activityId" element={<Activity />} />
                <Route path="/parents" element={<SettingsScreen />} />
                <Route path="/progress" element={<Progress />} />

                {needsOnboarding ? (
                  <Route path="*" element={<Navigate to="/onboarding" replace />} />
                ) : hasMultipleChildren && !activeChild ? (
                  <Route path="*" element={<Navigate to="/children" replace />} />
                ) : (
                  <>
                    <Route path="/" element={<Home />} />
                    <Route path="/lessons" element={<Lessons />} />
                    <Route path="/lessons/:worldId" element={<Lessons />} />
                    <Route path="/lessons/:worldId/:topicId" element={<Lessons />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </>
                )}
              </Routes>
            </Suspense>
          </main>
          {activeChild && !screenTimeLimitHit && <BottomNav />}
        </BrowserRouter>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default function App() {
  return <AppContent />;
}
