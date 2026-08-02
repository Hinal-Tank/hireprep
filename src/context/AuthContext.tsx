import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types.js';

interface AuthContextType extends AuthState {
  login: (loginTerm: string, passwordPlain: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, username: string, email: string, passwordPlain: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>, passwordPlain?: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('hireprep_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          localStorage.removeItem('hireprep_token');
          setToken(null);
          setUser(null);
        }
      } catch (e) {
        console.error('Error verifying auth token:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  const login = async (loginTerm: string, passwordPlain: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loginTerm, password: passwordPlain }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      localStorage.setItem('hireprep_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Server connection error' };
    }
  };

  const register = async (name: string, username: string, email: string, passwordPlain: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password: passwordPlain }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      localStorage.setItem('hireprep_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Server connection error' };
    }
  };

  const logout = () => {
    localStorage.removeItem('hireprep_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>, passwordPlain?: string) => {
    if (!token) return { success: false, error: 'Not authenticated' };
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data, password: passwordPlain }),
      });
      const resData = await res.json();

      if (!res.ok) {
        return { success: false, error: resData.error || 'Profile update failed' };
      }

      setUser(resData.user);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Server error' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
