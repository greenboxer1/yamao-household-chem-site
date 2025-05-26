import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from '../components/admin/LoginForm';
import AdminLayout from '../components/admin/AdminLayout';
import ProductManagement from '../components/admin/ProductManagement';
import Categories from '../components/admin/Categories';
import BannerManagement from '../components/admin/BannerManagement';
import ContactInfoManagement from '../components/admin/ContactInfoManagement';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="products" replace />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="categories" element={<Categories />} />
        <Route path="banners" element={<BannerManagement />} />
        <Route path="contact-info" element={<ContactInfoManagement />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
