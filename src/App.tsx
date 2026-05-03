import React, { FC } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import type { PageName } from './types';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MyGoalsPage from './pages/MyGoalsPage';
import ScenariosPage from './pages/ScenariosPage';
import LoginPage from './pages/LoginPage';
import { useAuth } from './contexts/AuthContext';

const PAGE_PATHS: Record<PageName, string> = {
  HOME: '/',
  'MY GOALS': '/my-goals',
  SCENARIOS: '/scenarios'
};

function pageNameFromPath(pathname: string): PageName {
  if (pathname.startsWith('/my-goals')) return 'MY GOALS';
  if (pathname.startsWith('/scenarios')) return 'SCENARIOS';
  return 'HOME';
}

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
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = pageNameFromPath(location.pathname);

  const handleNavigate = (page: PageName) => {
    navigate(PAGE_PATHS[page]);
  };

  return (
    <div className="app-container">
      <Header activeLink={currentPage} onNavigate={handleNavigate} />
      <main className="app-main">
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="my-goals" element={<MyGoalsPage />} />
          <Route path="scenarios" element={<ScenariosPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;