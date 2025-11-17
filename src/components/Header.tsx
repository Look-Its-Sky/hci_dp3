import { FC } from 'react';
import type { PageName } from '../types';

/**
 * Header Navigation Bar
 * This component is now controlled by App.tsx
 */
interface HeaderProps {
  activeLink: PageName;
  onNavigate: (page: PageName) => void;
}

const Header: FC<HeaderProps> = ({ activeLink, onNavigate }) => {
  const links: PageName[] = ["MY GOALS", "HOME", "SCENARIOS"];

  return (
    <nav className="header-nav">
      <div className="header-container">
        <div className="header-links">
            {links.map((link) => (
              <button
                key={link}
                onClick={() => onNavigate(link)}
                className={link === activeLink ? 'active' : ''}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
    </nav>
  );
};

export default Header;
