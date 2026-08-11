import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import ProductsList from './pages/ProductsList';
import ProductForm from './pages/ProductForm';
import ProductDetail from './pages/ProductDetail';
import CategoriesList from './pages/CategoriesList';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import CustomToaster from './components/CustomToaster';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductsList />} />
              <Route path="products/new" element={<ProductForm />} />
              <Route path="products/edit/:id" element={<ProductForm />} />
              <Route path="products/detail/:id" element={<ProductDetail />} />
              <Route path="categories" element={<CategoriesList />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <CustomToaster />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
