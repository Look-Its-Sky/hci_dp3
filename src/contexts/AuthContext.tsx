import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { UserFinancialProfile } from '../types';
import { USER_PROFILES } from '../data';

interface AuthContextType {
  isAuthenticated: boolean;
  currentUser: UserFinancialProfile | null;
  currentUserId: string | null;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserFinancialProfile | null>(null);

  const login = (userId: string) => {
    const user = USER_PROFILES[userId];
    if (user) {
      setCurrentUserId(userId);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUserId(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentUser, currentUserId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
