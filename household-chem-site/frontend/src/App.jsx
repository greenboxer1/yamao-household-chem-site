import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol, MDBSpinner } from 'mdb-react-ui-kit';
import { useState, useEffect, Suspense } from 'react';
import CategoryList from './components/CategoryList';
import ProductGrid from './components/ProductGrid';
import AdminRoutes from './routes/AdminRoutes';
import MainLayout from './components/layout/MainLayout';
import { FilterProvider } from './context/FilterContext';
import './App.css';

// Main App Component
const App = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  // Loading component for Suspense
  const LoadingSpinner = () => (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <MDBSpinner color="primary">
        <span className="visually-hidden">Loading...</span>
      </MDBSpinner>
    </div>
  );

  // Wrapper component to apply MainLayout to all non-admin routes
  const MainApp = ({ children }) => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');
    
    if (isAdminRoute) {
      return children;
    }
    
    return (
      <MainLayout>
        {children}
      </MainLayout>
    );
  };

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <FilterProvider>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/*" element={<AdminRoutes />} />
            
            {/* Main App Route */}
            <Route 
              path="/*" 
              element={
                <MainApp>
                  <div className="main-app">
                    <div className="container-fluid py-3 px-4 px-xxl-5">
                      <div className="row gx-4 gx-xxl-5">
                        <div className="col-12 col-md-5 col-lg-4 col-xl-4">
                          <div className="sticky-top" style={{ top: '1rem' }}>
                            <CategoryList categories={categories} />
                          </div>
                        </div>
                        <div className="col-12 col-md-7 col-lg-8 col-xl-8">
                          <ProductGrid categories={categories} />
                        </div>
                      </div>
                    </div>
                  </div>
                </MainApp>
              } 
            />
          </Routes>
        </FilterProvider>
      </Suspense>
    </Router>
  );
};

export default App;