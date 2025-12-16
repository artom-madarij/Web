import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadUserCart } from '../../store/slices/cartSlice';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = () => {
      const userEmail = localStorage.getItem('userEmail');
      setIsAuthenticated(!!userEmail);
      
      if (userEmail) {
        setTimeout(() => {
          dispatch(loadUserCart());
        }, 100);
      }
    };
    
    checkAuth();
    
    const handleStorageChange = (e) => {
      if (e.key === 'userEmail') {
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location, dispatch]);

  if (isAuthenticated === null) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Завантаження...</p>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;