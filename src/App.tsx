import React, { useState, FC } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import type { PageName } from './types';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MyGoalsPage from './pages/MyGoalsPage';
import ScenariosPage from './pages/ScenariosPage';
import LoginPage from './pages/LoginPage';
import { useAuth } from './contexts/AuthContext';

const App: FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <MainLayout />
          ) : (
            <Navigate to="/login" state={{ from: location }} replace />
          )
        }
      />
    </Routes>
  );
};

const MainLayout: FC = () => {
  const [currentPage, setCurrentPage] = useState<PageName>('HOME');

  const handleNavigate = (page: PageName) => {
    setCurrentPage(page);
  };

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
        <div key={currentPage} className="page-fade-in">
          {renderCurrentPage()}
        </div>
      </main>
    </div>
  );
};

export default App;

