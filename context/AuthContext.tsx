'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookie from 'js-cookie';

interface User {
  userId: string;
  email: string;
  firstName: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const checkAuth = async () => {
    //   try {
    //     const response = await fetch('/api/user', { credentials: 'include' });
    //     if (response.ok) {
    //       const data = await response.json();
    //       setUser(data.user);
    //     }
    //   } catch (error) {
    //     console.error('Auth check error:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };




//     const checkAuth = async () => {
//   try {
//     const response = await fetch('/api/user', { credentials: 'include' });
//     if (response.ok) {
//       const data = await response.json();
//       setUser(data.user); // make sure API { user: {...} } return kare
//     } else {
//       setUser(null); // 401 = not logged in
//     }
//   } catch (error) {
//     console.error('Auth check error:', error);
//     setUser(null);
//   } finally {
//     setLoading(false);
//   }
// };




// AuthContext.tsx mein checkAuth
const checkAuth = async () => {
  try {
    const response = await fetch('/api/user', { credentials: 'include' });
    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
    } else {
      setUser(null); // 401 = not logged in, NORMAL hai
    }
  } catch (error) {
    setUser(null); // console.error hata do agar irritate kar raha hai
  } finally {
    setLoading(false);
  }
};

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    // const data = await response.json();
    // setUser({
    //   userId: data.userId,
    //   email: data.email,
    //   firstName: data.firstName,
    // });


    const data = await response.json();

setUser({
  userId: data.user.userId,
  email: data.user.email,
  firstName: data.user.firstName,
});
  };

  const register = async (email: string, password: string, firstName?: string, lastName?: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, firstName, lastName }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    Cookie.remove('auth');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
