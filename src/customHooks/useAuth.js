import { useState, useEffect } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
      const token = user.token;
      const userRole = user.role;
      console.log('Token retrieved:', token);

      setIsAuthenticated(!!token);
      setRole(userRole);
    } else {
      setIsAuthenticated(false);
      setRole(null);
    }

    setLoading(false);
  }, []);

  return { isAuthenticated, loading, role };
};

export default useAuth;
