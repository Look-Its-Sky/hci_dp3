import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';

test('renders login page for unauthenticated user', () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
  const headingElement = screen.getByRole('heading', { name: /login/i });
  expect(headingElement).toBeInTheDocument();
});
