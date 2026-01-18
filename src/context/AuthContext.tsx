import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface Permission {
  id: number;
  name: string;
  key: string;
  parentId: number | null;
  parent: Permission | null;
}

export interface Application {
  memberId: string;
  member: any;
  lastCompletedSection: number;
  isCompleted: boolean;
  submittedDate: string;
  createdDate: string;
  status: number;
  membershipType: number;
  statusUpdatedDate: string;
  askDetailsDate: string | null;
  askMoreDetailsRequest: string | null;
  askMoreDetailsResponse: string | null;
  adminComments: string | null;
  id: number;
}

interface User {
  userId: string;
  name: string;
  email: string;
  userType: number; // 0/1 for member, 2 for admin, 3 for special user
  membershipType?: string;
  accessToken?: string;
  permissions?: Permission[];
  application?: Application;
  loginSource?: 'member' | 'admin'; // Track which login page was used
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  role: 'member' | 'admin' | null;
  permissions: Permission[];
  application: Application | null;
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
    const applicationStr = localStorage.getItem('application');

    let parsedPermissions: Permission[] = [];
    if (permissionsStr) {
      try {
        parsedPermissions = JSON.parse(permissionsStr);
        console.log('Loaded permissions from localStorage:', parsedPermissions);
      } catch (error) {
        console.error('Failed to parse permissions from localStorage:', error);
      }
    }

    let parsedApplication: Application | undefined = undefined;
    if (applicationStr) {
      try {
        parsedApplication = JSON.parse(applicationStr);
        console.log('Loaded application from localStorage:', parsedApplication);
      } catch (error) {
        console.error('Failed to parse application from localStorage:', error);
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
        application: parsedApplication,
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

  const [application, setApplication] = useState<Application | null>(() => {
    const applicationStr = localStorage.getItem('application');
    if (applicationStr) {
      try {
        const parsed = JSON.parse(applicationStr);
        console.log('Initial application loaded:', parsed);
        return parsed;
      } catch (error) {
        console.error('Failed to parse application:', error);
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    // Optional: Re-check or update if needed, but since we initialize synchronously, this might not be necessary
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);

    // Determine role based on userType and loginSource
    let userRole: 'member' | 'admin';
    if (userData.userType === 2) {
      userRole = 'admin';
    } else if (userData.userType === 3) {
      // userType 3 role depends on login source
      userRole = userData.loginSource === 'admin' ? 'admin' : 'member';
    } else {
      userRole = 'member';
    }

    setRole(userRole);
    setPermissions(userData.permissions || []);
    setApplication(userData.application || null);

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
    if (userData.application) {
      try {
        const applicationJson = JSON.stringify(userData.application);
        localStorage.setItem('application', applicationJson);
        console.log('Saved application to localStorage:', userData.application);
      } catch (error) {
        console.error('Failed to save application:', error);
      }
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setRole(null);
    setPermissions([]);
    setApplication(null);

    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
    localStorage.removeItem('email');
    localStorage.removeItem('userType');
    localStorage.removeItem('membershipType');
    localStorage.removeItem('permissions');
    localStorage.removeItem('application');
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
    application,
    hasPermission,
    canCreate,
    canEdit,
    canView,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
