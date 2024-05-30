import { useState, useEffect } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    console.log('Token retrieved:', token);

    setIsAuthenticated(!!token);
    setRole(userRole);
    setLoading(false);
  }, []);

  return { isAuthenticated, loading, role };
};

export default useAuth;
