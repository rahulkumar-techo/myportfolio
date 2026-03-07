'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo credentials for testing
const DEMO_USER: User = {
  id: '1',
  email: 'admin@portfolio.dev',
  name: 'Admin User',
  role: 'admin',
};

const DEMO_PASSWORD = 'admin123';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = sessionStorage.getItem('portfolio_admin_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Redirect logic
    if (!isLoading) {
      const isAdminRoute = pathname?.startsWith('/admin');
      const isLoginPage = pathname === '/admin/login';

      if (isAdminRoute && !isLoginPage && !user) {
        router.push('/admin/login');
      } else if (isLoginPage && user) {
        router.push('/admin');
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo authentication - in production, this would call an API
    if (email === DEMO_USER.email && password === DEMO_PASSWORD) {
      setUser(DEMO_USER);
      sessionStorage.setItem('portfolio_admin_user', JSON.stringify(DEMO_USER));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('portfolio_admin_user');
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
