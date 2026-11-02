import { NavLink } from 'react-router-dom';
import { useTheme } from '@/themes/ThemeContext';
import { localized } from '@/services/i18n';
import './BottomNav.css';

export function BottomNav() {
  const { theme } = useTheme();

  const tabs = [
    { to: '/', icon: theme.navIcons.home, label: localized(theme.navLabels.home) },
    { to: '/lessons', icon: theme.navIcons.lessons, label: localized(theme.navLabels.lessons) },
    { to: '/favorites', icon: theme.navIcons.favorites, label: localized(theme.navLabels.favorites) },
    { to: '/parents', icon: theme.navIcons.parents, label: localized(theme.navLabels.parents) },
  ];

  return (
    <nav className="bottom-nav" aria-label="Main navigation">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `bottom-nav__tab ${isActive ? 'bottom-nav__tab--active' : ''}`
          }
        >
          <span className="bottom-nav__icon">{tab.icon}</span>
          <span className="bottom-nav__label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
