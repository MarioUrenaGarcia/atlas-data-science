import { Menu, Monitor, Moon, Search, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button.tsx';
import { SegmentedControl } from '../../components/ui/SegmentedControl.tsx';
import { usePreferences, type ThemePreference } from '../../store/preferences.ts';
import { useUi } from '../../store/ui.ts';
import { strings } from '../strings.ts';
import { Logo } from './Logo.tsx';
import styles from './Header.module.css';

const NAV_ITEMS = [
  { to: '/modulos', label: strings.nav.modules },
  { to: '/rutas', label: strings.nav.routes },
  { to: '/mapa', label: strings.nav.map },
  { to: '/glosario', label: strings.nav.glossary },
  { to: '/progreso', label: strings.nav.progress },
] as const;

const THEME_OPTIONS = [
  { value: 'sistema', label: strings.theme.system, icon: <Monitor size={16} aria-hidden="true" /> },
  { value: 'claro', label: strings.theme.light, icon: <Sun size={16} aria-hidden="true" /> },
  { value: 'oscuro', label: strings.theme.dark, icon: <Moon size={16} aria-hidden="true" /> },
] as const satisfies readonly { value: ThemePreference; label: string; icon: JSX.Element }[];

export function Header() {
  const theme = usePreferences((state) => state.theme);
  const setTheme = usePreferences((state) => state.setTheme);
  const openSearch = useUi((state) => state.openSearch);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu after navigating, adjusting state during render instead of in an effect.
  const [lastPath, setLastPath] = useState(location.pathname);
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname);
    setMenuOpen(false);
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand} aria-label={strings.nav.home}>
          <Logo />
          <span className={styles.brandText}>{strings.appName}</span>
        </Link>

        <nav
          id="navegacion-principal"
          aria-label={strings.nav.label}
          className={menuOpen ? `${styles.nav} ${styles.navOpen}` : styles.nav}
        >
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className={styles.navTheme}>
            <SegmentedControl
              label={strings.theme.label}
              value={theme}
              options={THEME_OPTIONS}
              onChange={setTheme}
            />
          </div>
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.searchButton}
            aria-label={strings.search.open}
            aria-keyshortcuts="Control+K /"
            onClick={() => openSearch()}
          >
            <Search size={16} aria-hidden="true" />
            <span className={styles.searchLabel}>{strings.search.open}</span>
            <kbd className={styles.searchKbd} aria-hidden="true">
              Ctrl K
            </kbd>
          </button>
          <div className={styles.theme}>
            <SegmentedControl
              label={strings.theme.label}
              value={theme}
              options={THEME_OPTIONS}
              onChange={setTheme}
              hideLabels
            />
          </div>
          <Button
            variant="ghost"
            iconOnly
            className={styles.menuButton}
            aria-expanded={menuOpen}
            aria-controls="navegacion-principal"
            aria-label={menuOpen ? strings.nav.closeMenu : strings.nav.openMenu}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
