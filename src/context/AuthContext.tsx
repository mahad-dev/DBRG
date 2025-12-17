import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  userId: string;
  name: string;
  email: string;
  userType: number; // 0/1 for member, 2 for admin
  membershipType?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  role: 'member' | 'admin' | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const userType = localStorage.getItem('userType');
    return !!(token && userId && name && email && userType);
  });

  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const userType = localStorage.getItem('userType');
    const membershipType = localStorage.getItem('membershipType');

    if (token && userId && name && email && userType) {
      return {
        userId,
        name,
        email,
        userType: parseInt(userType),
        membershipType: membershipType || undefined,
      };
    }
    return null;
  });

  const [role, setRole] = useState<'member' | 'admin' | null>(() => {
    const userType = localStorage.getItem('userType');
    if (userType) {
      return parseInt(userType) === 2 ? 'admin' : 'member';
    }
    return null;
  });

  useEffect(() => {
    // Optional: Re-check or update if needed, but since we initialize synchronously, this might not be necessary
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    setRole(userData.userType === 2 ? 'admin' : 'member');

    // Store in localStorage
    localStorage.setItem('accessToken', localStorage.getItem('accessToken') || '');
    localStorage.setItem('userId', userData.userId);
    localStorage.setItem('name', userData.name);
    localStorage.setItem('email', userData.email);
    localStorage.setItem('userType', userData.userType.toString());
    if (userData.membershipType) {
      localStorage.setItem('membershipType', userData.membershipType);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setRole(null);

    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('userType');
    localStorage.removeItem('membershipType');
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    role,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
