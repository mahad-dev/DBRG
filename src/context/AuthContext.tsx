import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface Permission {
  id: number;
  name: string;
  key: string;
  parentId: number | null;
  parent: Permission | null;
}

interface User {
  userId: string;
  name: string;
  email: string;
  userType: number; // 0/1 for member, 2 for admin
  membershipType?: string;
  accessToken?: string;
  permissions?: Permission[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  role: 'member' | 'admin' | null;
  permissions: Permission[];
  hasPermission: (permissionKey: string) => boolean;
  canCreate: (module: string) => boolean;
  canEdit: (module: string) => boolean;
  canView: (module: string) => boolean;
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
    const email = localStorage.getItem('email');
    const userType = localStorage.getItem('userType');
    // Note: name can be empty, so we don't require it for authentication
    return !!(token && userId && email && userType);
  });

  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('accessToken');
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const userType = localStorage.getItem('userType');
    const membershipType = localStorage.getItem('membershipType');
    const permissionsStr = localStorage.getItem('permissions');

    let parsedPermissions: Permission[] = [];
    if (permissionsStr) {
      try {
        parsedPermissions = JSON.parse(permissionsStr);
        console.log('Loaded permissions from localStorage:', parsedPermissions);
      } catch (error) {
        console.error('Failed to parse permissions from localStorage:', error);
      }
    }

    if (token && userId && email && userType) {
      return {
        userId,
        name: name || email?.split('@')[0] || 'User',
        email,
        userType: parseInt(userType),
        membershipType: membershipType || undefined,
        permissions: parsedPermissions,
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

  const [permissions, setPermissions] = useState<Permission[]>(() => {
    const permissionsStr = localStorage.getItem('permissions');
    if (permissionsStr) {
      try {
        const parsed = JSON.parse(permissionsStr);
        console.log('Initial permissions loaded:', parsed);
        return parsed;
      } catch (error) {
        console.error('Failed to parse permissions:', error);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    // Optional: Re-check or update if needed, but since we initialize synchronously, this might not be necessary
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    setRole(userData.userType === 2 ? 'admin' : 'member');
    setPermissions(userData.permissions || []);

    // Store in localStorage
    if (userData.accessToken) {
      localStorage.setItem('accessToken', userData.accessToken);
    }
    localStorage.setItem('userId', userData.userId);
    localStorage.setItem('name', userData.name);
    localStorage.setItem('email', userData.email);
    localStorage.setItem('userType', userData.userType.toString());
    if (userData.membershipType) {
      localStorage.setItem('membershipType', userData.membershipType);
    }
    if (userData.permissions) {
      try {
        // Handle circular references by using a replacer function
        const seen = new WeakSet();
        const permissionsJson = JSON.stringify(userData.permissions, (_key, value) => {
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
              return; // Remove circular reference
            }
            seen.add(value);
          }
          return value;
        });
        localStorage.setItem('permissions', permissionsJson);
        console.log('Saved permissions to localStorage:', userData.permissions);
      } catch (error) {
        console.error('Failed to save permissions:', error);
      }
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setRole(null);
    setPermissions([]);

    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('userType');
    localStorage.removeItem('membershipType');
    localStorage.removeItem('permissions');
  };

  // Permission helper functions
  const hasPermission = (permissionKey: string): boolean => {
    return permissions.some(p => p.key === permissionKey);
  };

  const canCreate = (module: string): boolean => {
    return hasPermission(`${module}.CREATE`);
  };

  const canEdit = (module: string): boolean => {
    // If user has CREATE permission, they can also EDIT
    return hasPermission(`${module}.CREATE`) || hasPermission(`${module}.EDIT`);
  };

  const canView = (module: string): boolean => {
    // If user has any permission for the module, they can view
    const result = hasPermission(module) ||
           hasPermission(`${module}.GET`) ||
           hasPermission(`${module}.CREATE`) ||
           hasPermission(`${module}.EDIT`);

    console.log(`canView(${module}):`, result, 'Available permissions:', permissions.map(p => p.key));
    return result;
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    role,
    permissions,
    hasPermission,
    canCreate,
    canEdit,
    canView,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
