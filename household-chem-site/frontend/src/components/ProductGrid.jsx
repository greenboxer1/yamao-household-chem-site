import { useState, useEffect, useRef } from 'react';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import ProductCard from './ProductCard';

function ProductGrid({ selectedCategory, priceFrom, priceTo, sortOrder, searchQuery }) {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const loaderRef = useRef(null);
  const limit = 10;
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Reset pagination when filters change
  useEffect(() => {
    setOffset(0);
  }, [selectedCategory, priceFrom, priceTo, sortOrder, searchQuery]);

  // Fetch products with debounce
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        
        if (selectedCategory) params.append('categoryId', selectedCategory);
        if (priceFrom) params.append('priceFrom', priceFrom);
        if (priceTo) params.append('priceTo', priceTo);
        if (sortOrder) params.append('sortOrder', sortOrder);
        if (searchQuery && searchQuery.trim() !== '') {
            // Remove extra spaces and normalize the search query
            const normalizedSearch = searchQuery.trim().replace(/\s+/g, ' ');
            // Ensure proper encoding of the search term
            const encodedSearch = encodeURIComponent(normalizedSearch);
            params.append('search', encodedSearch);
            console.log('Searching for (normalized):', normalizedSearch);
            console.log('Searching for (encoded):', encodedSearch);
        }
        
        params.append('limit', limit);
        params.append('offset', offset);
        
        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch products');
        
        const newProducts = await res.json();
        
        setHasMore(newProducts.length === limit);
        setProducts(prev => offset === 0 ? newProducts : [...prev, ...newProducts]);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Clear previous timeout
    if (searchTimeout) clearTimeout(searchTimeout);
    
    // Set new timeout
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    
    setSearchTimeout(timer);
    
    // Cleanup
    return () => clearTimeout(timer);
  }, [selectedCategory, priceFrom, priceTo, sortOrder, searchQuery, offset]);



  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          setOffset(prev => prev + limit);
        }
      },
      { threshold: 1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [hasMore]);

  // Show loading indicator
  if (isLoading && products.length === 0) {
    return (
      <MDBContainer className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </MDBContainer>
    );
  }

  // Show no results message
  if (products.length === 0 && !isLoading) {
    return (
      <MDBContainer className="text-center py-5">
        <h3>Товары не найдены</h3>
        <p>Попробуйте изменить параметры поиска или фильтры</p>
      </MDBContainer>
    );
  }

  return (
    <MDBContainer>
      <MDBRow>
        {products.map(product => (
          <MDBCol md="4" key={product.id} className="mb-4">
            <ProductCard product={product} />
          </MDBCol>
        ))}
      </MDBRow>
      
      {/* Infinite scroll loader */}
      {hasMore && (
        <div ref={loaderRef} className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      )}
    </MDBContainer>
  );
}

export default ProductGrid;