import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, storeService } from '@/services/api';
import { type User, type Store, type UserRole } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  store: Store | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateRole: (role: UserRole) => void; // For dev testing
  hasPermission: (permission: Permission) => boolean;
}

type Permission = 
  | 'view:dashboard'
  | 'view:products'
  | 'edit:products'
  | 'view:posts'
  | 'edit:posts'
  | 'view:calendar'
  | 'edit:calendar'
  | 'view:autopilot'
  | 'edit:autopilot'
  | 'view:insights'
  | 'view:inbox'
  | 'reply:inbox'
  | 'view:settings'
  | 'edit:settings'
  | 'view:billing'
  | 'edit:billing'
  | 'manage:team';

const rolePermissions: Record<UserRole, Permission[]> = {
  admin: [
    'view:dashboard', 'view:products', 'edit:products', 'view:posts', 'edit:posts',
    'view:calendar', 'edit:calendar', 'view:autopilot', 'edit:autopilot',
    'view:insights', 'view:inbox', 'reply:inbox', 'view:settings', 'edit:settings',
    'view:billing', 'edit:billing', 'manage:team',
  ],
  manager: [
    'view:dashboard', 'view:products', 'edit:products', 'view:posts', 'edit:posts',
    'view:calendar', 'edit:calendar', 'view:autopilot', 'edit:autopilot',
    'view:insights', 'view:inbox', 'reply:inbox', 'view:settings', 'edit:settings',
  ],
  operator: [
    'view:dashboard', 'view:products', 'view:posts', 'edit:posts',
    'view:calendar', 'view:inbox', 'reply:inbox',
  ],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('postaja-token');
    if (token) {
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const [currentUser, currentStore] = await Promise.all([
        authService.getCurrentUser(),
        storeService.getStore(),
      ]);
      setUser(currentUser);
      setStore(currentStore);
    } catch (error) {
      localStorage.removeItem('postaja-token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { user: loggedUser, token } = await authService.login(email, password);
    localStorage.setItem('postaja-token', token);
    setUser(loggedUser);
    const storeData = await storeService.getStore();
    setStore(storeData);
  };

  const register = async (name: string, email: string, password: string) => {
    const { user: newUser, token } = await authService.register({ name, email, password });
    localStorage.setItem('postaja-token', token);
    setUser(newUser);
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('postaja-token');
    setUser(null);
    setStore(null);
  };

  const updateRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return rolePermissions[user.role].includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        store,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
