import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/auth/register';
import ForgotPassword from './pages/auth/forgot-password';
import ResetPassword from './pages/auth/reset-password';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import KDS from './pages/KDS';
import ProductManagement from './pages/management/products'; // Updated Import
import StaffManagement from './pages/management/staff'; 
import Inventory from './pages/Inventory';
import Settings from './pages/Settings';
import Profile from './pages/profile';
import { useAuthStore } from './store';
import ToastContainer from './components/ui/ToastContainer';
import DevAuthMenu from './components/dev/DevAuthMenu';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <HashRouter>
      <ScrollToTop />
      <ToastContainer />
      <DevAuthMenu />
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="/pos" element={
          <PrivateRoute>
            <POS />
          </PrivateRoute>
        } />
        
        <Route path="/kds" element={
          <PrivateRoute>
            <KDS />
          </PrivateRoute>
        } />
        
        <Route path="/products" element={
          <PrivateRoute>
            <ProductManagement />
          </PrivateRoute>
        } />
        
        <Route path="/employees" element={
          <PrivateRoute>
            <StaffManagement />
          </PrivateRoute>
        } />
        
        <Route path="/inventory" element={
          <PrivateRoute>
            <Inventory />
          </PrivateRoute>
        } />
        
        <Route path="/settings" element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        } />

        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;