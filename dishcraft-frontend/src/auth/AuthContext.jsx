import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [jwt, setJwt] = useState(localStorage.getItem('jwt'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  useEffect(() => {
    if (jwt) {
      localStorage.setItem('jwt', jwt);
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('jwt');
      localStorage.removeItem('userId');
    }
  }, [jwt, userId]);

  return (
    <AuthContext.Provider value={{ jwt, setJwt, userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
