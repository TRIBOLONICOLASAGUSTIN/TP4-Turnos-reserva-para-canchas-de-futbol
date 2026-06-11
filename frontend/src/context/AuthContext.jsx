import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('ttc_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  function login(userData, token) {
    localStorage.setItem('ttc_token', token);
    localStorage.setItem('ttc_user', JSON.stringify(userData));
    setUser(userData);
  }

  function logout() {
    localStorage.removeItem('ttc_token');
    localStorage.removeItem('ttc_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin: user?.rol === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
