import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI, User } from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const signUp = async (name: string, email: string, password: string) => {
    try {
      const response = await authAPI.signup(name, email, password);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      
      return { error: null };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      
      return { error: null };
    } catch (error: any) {
      return { error: error.response?.data?.message || error.message };
    }
  };

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
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
