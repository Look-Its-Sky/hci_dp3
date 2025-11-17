import React, { useState, FC } from 'react';
import type { PageName } from './types';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MyGoalsPage from './pages/MyGoalsPage';
import ScenariosPage from './pages/ScenariosPage';

// --- Main Application Component ---
/**
 * This is the main "App" component.
 * It controls which page is currently visible.
 */
const App: FC = () => {
  // 'HOME' or 'MY GOALS' or 'SCENARIOS'
  const [currentPage, setCurrentPage] = useState<PageName>('HOME'); // Changed default to show the new page

  const handleNavigate = (page: PageName) => {
    setCurrentPage(page);
  };

  /**
   * This function renders the correct page based on the
   * currentPage state.
   */
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'HOME':
        return <HomePage />;
      case 'MY GOALS':
        return <MyGoalsPage />;
      case 'SCENARIOS':
        return <ScenariosPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app-container">
      <Header activeLink={currentPage} onNavigate={handleNavigate} />
      
      <main className="app-main">
        {/* Add a key to the wrapping div to re-trigger the animation on page change */}
        <div key={currentPage} className="page-fade-in">
          {renderCurrentPage()} {/* Renders the active page */}
        </div>
      </main>
    </div>
  );
}

export default App;

