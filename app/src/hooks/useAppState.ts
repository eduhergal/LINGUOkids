import { createContext, useContext } from 'react';
import type { Child, Settings } from '@/types';

export interface AppState {
  activeChild: Child | null;
  setActiveChild: (child: Child | null) => void;
  settings: Settings | null;
  refreshSettings: () => Promise<void>;
}

export const AppContext = createContext<AppState>({
  activeChild: null,
  setActiveChild: () => {},
  settings: null,
  refreshSettings: async () => {},
});

export function useApp(): AppState {
  return useContext(AppContext);
}
