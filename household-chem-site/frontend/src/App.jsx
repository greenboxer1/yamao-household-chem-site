import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol, MDBSpinner } from 'mdb-react-ui-kit';
import { useState, useEffect, Suspense, lazy } from 'react';
import CategoryList from './components/CategoryList';
import ProductGrid from './components/ProductGrid';
import AdminRoutes from './routes/AdminRoutes';
import MainLayout from './components/layout/MainLayout';
import AboutPage from './pages/AboutPage';
import StoresPage from './pages/StoresPage';
import NotFoundPage from './pages/NotFoundPage';
import { FilterProvider } from './context/FilterContext';
import './App.css';
import AdminCredentials from './components/admin/AdminCredentials';

// Main App Component
const App = () => {
  const [categories, setCategories] = useState([]);
  const [contactInfo, setContactInfo] = useState({ 
    phone: '',
    email: '',
    vkUrl: '',
    telegramUrl: '',
    whatsappUrl: ''
  });
  const [loadingContactInfo, setLoadingContactInfo] = useState(true);
  const [errorContactInfo, setErrorContactInfo] = useState(null);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Failed to fetch categories", err));

    // Fetch contact information
    fetch('/api/contact-info')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setContactInfo(data);
        setErrorContactInfo(null);
      })
      .catch(err => {
        console.error("Failed to fetch contact info:", err);
        setErrorContactInfo('Не удалось загрузить контактную информацию.');
        // Keep default/empty contact info if fetch fails
      })
      .finally(() => {
        setLoadingContactInfo(false);
      });
  }, []);

  // Loading component for Suspense
  const LoadingSpinner = () => (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <MDBSpinner color="primary">
        <span className="visually-hidden">Loading...</span>
      </MDBSpinner>
    </div>
  );

  // Lazy load pages
  const PromotionsPage = lazy(() => import('./pages/PromotionsPage'));

  // Wrapper component to apply MainLayout to all non-admin routes
  const MainApp = ({ children }) => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');
    
    if (isAdminRoute) {
      return children;
    }

    if (loadingContactInfo) {
      return (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <MDBSpinner color="primary">
            <span className="visually-hidden">Loading contact info...</span>
          </MDBSpinner>
        </div>
      );
    }

    if (errorContactInfo) {
      // Optionally, render a specific error message or fallback UI
      // For now, we'll proceed with potentially empty contactInfo in MainLayout
      console.warn("Rendering MainLayout with potentially empty or default contact info due to fetch error.");
    }
    
    return (
      <MainLayout contactInfo={contactInfo}> 
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
            
            {/* About Page */}
            <Route 
              path="/about" 
              element={
                <MainApp>
                  <AboutPage />
                </MainApp>
              } 
            />
            
            {/* Promotions Page - Now the default route */}
            <Route 
              path="/" 
              element={
                <MainApp>
                  <PromotionsPage />
                </MainApp>
              }
            />

            {/* Stores Page */}
            <Route 
              path="/stores" 
              element={
                <MainApp>
                  <StoresPage />
                </MainApp>
              } 
            />
            
            {/* Main Catalog Route - Moved to /catalog */}
            <Route 
              path="/catalog" 
              element={
                <MainApp>
                  <div className="main-app">
                    <div className="container-fluid py-3 px-4 px-xxl-5">
                      <div className="row gx-4 gx-xxl-5">
                        <div className="col-12 col-md-5 col-lg-4 col-xl-4">
                          <div className="sticky-top" style={{ top: '120px', zIndex: 1000 }}>
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

            {/* Catch-all route for 404 Not Found - must be last */}
            <Route 
              path="*" 
              element={ (
                <MainApp>
                  <NotFoundPage />
                </MainApp>
              ) }
            />
          </Routes>
        </FilterProvider>
      </Suspense>
    </Router>
  );
};

export default App;