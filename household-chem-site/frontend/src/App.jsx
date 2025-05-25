import { useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import CategoryList from './components/CategoryList';
import ProductGrid from './components/ProductGrid';

function App() {
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

  return (
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
  );
}

export default App;