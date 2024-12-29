import { createContext, useContext, useState, useEffect } from 'react';
import * as AppPreferences from '../utility/AppPreference';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [academicYear, setAcademicYear] = useState(null);
  const login = async () => {
    setIsAuthenticated(true);
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUserDetails(null);
    setAcademicYear(null);
    setUserToken(null);
    await AppPreferences.clearAll();
  };

  const addUserDetailsToContext = async (userDetails) => {
    setUserDetails(userDetails);
    await AppPreferences.setValue('user_details', JSON.stringify(userDetails));
  };

  const addAcademicYearToContext = async (academicYear) => {
    setAcademicYear(academicYear);
    await AppPreferences.setValue('academic_details', JSON.stringify(academicYear));
  };

  useEffect(() => {
    (async () => {
      const storedToken = await AppPreferences.getValue('userToken');
      const storedUserDetails = await AppPreferences.getValue('user_details');
      const storedAcademicDetails = await AppPreferences.getValue('academic_details');
      setIsAuthenticated(() => (storedToken ? true : false));
      setUserToken(userToken);
      setUserDetails(() => (storedUserDetails ? JSON.parse(storedUserDetails) : null));
      setAcademicYear(() => (storedAcademicDetails ? JSON.parse(storedAcademicDetails) : null));
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userDetails,academicYear, userToken, login, logout, addUserDetailsToContext, addAcademicYearToContext }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
