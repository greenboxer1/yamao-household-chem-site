import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from '../components/admin/LoginForm';
import AdminLayout from '../components/admin/AdminLayout';
import ProductManagement from '../components/admin/ProductManagement';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="products" replace />} />
        <Route path="products" element={<ProductManagement />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
