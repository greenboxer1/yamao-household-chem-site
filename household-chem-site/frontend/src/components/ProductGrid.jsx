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

  // Reset pagination and products when filters change
  useEffect(() => {
    setProducts([]);
    setOffset(0);
    setHasMore(true);
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
        if (sortOrder && (sortOrder === 'asc' || sortOrder === 'desc')) {
            params.append('sortOrder', sortOrder);
        }
        if (searchQuery && searchQuery.trim() !== '') {
            // Normalize the search query - trim and replace multiple spaces
            const normalizedSearch = searchQuery
                .trim()
                .replace(/\s+/g, ' ') // Replace multiple spaces with single space
                .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
                .toLowerCase();
            
            // Add to params
            params.append('search', normalizedSearch);
            console.log('Search query (normalized):', normalizedSearch);
            
            // When searching, we want to search across all categories
            params.delete('categoryId');
        }
        
        params.append('limit', limit);
        params.append('offset', offset);
        
        const res = await fetch(`/api/products?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch products');
        
        const newProducts = await res.json();
        
        // If we got fewer products than the limit, we've reached the end
        const hasMoreItems = newProducts.length === limit;
        setHasMore(hasMoreItems);
        
        // If offset is 0, replace the products, otherwise append to existing ones
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



  // Handle infinite scroll with intersection observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !isLoading) {
        setOffset(prev => prev + limit);
      }
    }, options);

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, isLoading, limit]);

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
      <div ref={loaderRef} className="text-center py-4">
        {isLoading && hasMore && (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        )}
        {!hasMore && products.length > 0 && (
          <p className="text-muted">Показаны все товары</p>
        )}
      </div>
    </MDBContainer>
  );
}

export default ProductGrid;