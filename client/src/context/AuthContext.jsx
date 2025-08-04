import { createContext, useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(token ? jwtDecode(token) : null);

  const login = (jwt) => {
    localStorage.setItem('token', jwt);
    setToken(jwt);
    setUser(jwtDecode(jwt));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = { token, user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
