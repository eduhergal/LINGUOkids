import { getSettings } from '@/db/database';

const SESSION_KEY = 'linguokids_session_start';

export function startSession(): void {
  if (!sessionStorage.getItem(SESSION_KEY)) {
    sessionStorage.setItem(SESSION_KEY, Date.now().toString());
  }
}

export function getSessionMinutes(): number {
  const start = sessionStorage.getItem(SESSION_KEY);
  if (!start) return 0;
  return (Date.now() - Number(start)) / 60_000;
}

export async function isScreenTimeLimitReached(): Promise<boolean> {
  const settings = await getSettings();
  if (settings.screenTimeLimitMinutes <= 0) return false;
  return getSessionMinutes() >= settings.screenTimeLimitMinutes;
}

export function resetSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
