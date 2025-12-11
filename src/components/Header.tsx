import { FC } from 'react';
import type { PageName } from '../types';

/**
 * Header Navigation Bar
 */
interface HeaderProps {
  activeLink: PageName;
  onNavigate: (page: PageName) => void;
}

const Header: FC<HeaderProps> = ({ activeLink, onNavigate }) => {
  const links: { name: PageName; icon: string }[] = [
    { name: "MY GOALS", icon: "" },
    { name: "HOME", icon: "" },
    { name: "SCENARIOS", icon: "" }
  ];

  return (
    <nav className="header-nav">
      <div className="header-container">
        <div className="header-links">
          {links.map((link) => (
            <button
              key={link.name}
              onClick={() => onNavigate(link.name)}
              className={`nav-link ${link.name === activeLink ? 'active' : ''}`}
              aria-current={link.name === activeLink ? 'page' : undefined}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-text">{link.name}</span>
              {link.name === activeLink && <span className="nav-indicator" />}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Header;
