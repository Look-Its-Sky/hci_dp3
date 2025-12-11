import { FC } from 'react';
import type { PageName } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  activeLink: PageName;
  onNavigate: (page: PageName) => void;
}

const Header: FC<HeaderProps> = ({ activeLink, onNavigate }) => {
  const { logout, currentUser } = useAuth();
  
  const links: { name: PageName; icon: string }[] = [
    { name: "MY GOALS", icon: "🎯" },
    { name: "HOME", icon: "📊" },
    { name: "SCENARIOS", icon: "🔮" }
  ];

  const handleLogout = () => {
    logout();
  };

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
          <div className="header-user-section">
            {currentUser && (
              <span className="user-name">{currentUser.name}</span>
            )}
            <button className="logout-btn" onClick={handleLogout}>
              <span className="logout-icon">🚪</span>
              <span className="logout-text">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
