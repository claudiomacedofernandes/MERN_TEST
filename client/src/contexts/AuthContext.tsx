import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  userid: string | null;
  username: string | null;
  userrole: string | null;
  login: (token: string, userid: string, username: string, userrole: string) => void;
  logout: () => void;
  updateRole: (userrole: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [userid, setUserId] = useState<string | null>(localStorage.getItem('userid'));
  const [username, setUserName] = useState<string | null>(localStorage.getItem('username'));
  const [userrole, setUserRole] = useState<string | null>(localStorage.getItem('userrole'));

  const login = (usertoken: string, userid: string, username: string, userrole: string) => {
    localStorage.setItem('token', usertoken);
    localStorage.setItem('userid', userid);
    localStorage.setItem('username', username);
    localStorage.setItem('userrole', userrole);
    setToken(usertoken);
    setUserId(userid);
    setUserName(username);
    setUserRole(userrole);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userid');
    localStorage.removeItem('username');
    localStorage.removeItem('userrole');
    setToken(null);
    setUserId(null);
    setUserName(null);
    setUserRole(null);
  };

  const updateRole = (userrole: string) => {
    localStorage.setItem('userrole', userrole);
    setUserRole(userrole);
  };

  return (
    <AuthContext.Provider value={{ token, userid, username, userrole, login, logout, updateRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
