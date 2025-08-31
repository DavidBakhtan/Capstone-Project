import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';
import type { AuthResponse, User, LoginCredentials } from './types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load stored auth on mount
    const stored = localStorage.getItem('ext-auth');
    if (stored) {
      try {
        const parsed: AuthResponse = JSON.parse(stored);
        setUser(parsed.user);
        setToken(parsed.token);
        api.setToken(parsed.token);
      } catch (error) {
        console.error('Failed to parse stored auth:', error);
        localStorage.removeItem('ext-auth');
      }
    }
    setIsLoading(false);

    // Listen for Angular auth events
    const handleAngularAuth = (event: Event) => {
      const customEvent = event as CustomEvent<AuthResponse>;
      if (customEvent.detail) {
        applyLogin(customEvent.detail);
      }
    };

    window.addEventListener('auth:login', handleAngularAuth);
    return () => window.removeEventListener('auth:login', handleAngularAuth);
  }, []);

  const applyLogin = (authResponse: AuthResponse) => {
    setUser(authResponse.user);
    setToken(authResponse.token);
    api.setToken(authResponse.token);
    localStorage.setItem('ext-auth', JSON.stringify(authResponse));
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      applyLogin(response);
      
      // Redirect to home after successful login
      window.history.pushState({}, '', '/');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    api.setToken(null);
    localStorage.removeItem('ext-auth');
    
    // Redirect to home after logout
    window.history.pushState({}, '', '/');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
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