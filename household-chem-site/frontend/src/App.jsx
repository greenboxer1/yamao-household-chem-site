import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol, MDBSpinner } from 'mdb-react-ui-kit';
import { useState, useEffect, Suspense } from 'react';
import CategoryList from './components/CategoryList';
import ProductGrid from './components/ProductGrid';
import AdminButton from './components/AdminButton';
import AdminRoutes from './routes/AdminRoutes';
import './App.css';

// Main App Component
const App = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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



  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          
          {/* Main App Route */}
          <Route 
            path="/*" 
            element={
              <div className="main-app">
                <MDBContainer fluid className="my-5">
                  <MDBRow>
                    <MDBCol md="3">
                      <CategoryList
                        categories={categories}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={setSelectedCategory}
                        priceFrom={priceFrom}
                        setPriceFrom={setPriceFrom}
                        priceTo={priceTo}
                        setPriceTo={setPriceTo}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                      />
                    </MDBCol>
                    <MDBCol md="9">
                      <ProductGrid 
                        selectedCategory={selectedCategory} 
                        priceFrom={priceFrom}
                        priceTo={priceTo}
                        sortOrder={sortOrder}
                        searchQuery={searchQuery}
                      />
                    </MDBCol>
                  </MDBRow>
                </MDBContainer>
                <AdminButton />
              </div>
            } 
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;