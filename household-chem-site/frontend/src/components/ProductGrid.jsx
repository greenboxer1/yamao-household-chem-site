import { useState, useEffect, useRef } from 'react';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import ProductCard from './ProductCard';

function ProductGrid({ selectedCategory, priceFrom, priceTo, sortOrder }) {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const loaderRef = useRef(null);
  const limit = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      setProducts([]);
      setOffset(0);
      setHasMore(true);
      const params = new URLSearchParams({
        categoryId: selectedCategory || '',
        priceFrom: priceFrom || '',
        priceTo: priceTo || '',
        sortOrder: sortOrder || '',
        limit,
        offset: 0
      });
      const res = await fetch(`/api/products?${params}`);
      const newProducts = await res.json();
      if (newProducts.length < limit) setHasMore(false);
      setProducts(newProducts);
    };
    fetchProducts();
  }, [selectedCategory, priceFrom, priceTo, sortOrder]);

  useEffect(() => {
    if (!hasMore || offset === 0) return;
    const fetchProducts = async () => {
      const params = new URLSearchParams({
        categoryId: selectedCategory || '',
        priceFrom: priceFrom || '',
        priceTo: priceTo || '',
        sortOrder: sortOrder || '',
        limit,
        offset
      });
      const res = await fetch(`/api/products?${params}`);
      const newProducts = await res.json();
      if (newProducts.length < limit) setHasMore(false);
      setProducts(prev => [...prev, ...newProducts]);
    };
    fetchProducts();
  }, [offset]);

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

  return (
    <MDBContainer>
      <MDBRow>
        {products.map(product => (
          <MDBCol md="4" key={product.id}>
            <ProductCard product={product} />
          </MDBCol>
        ))}
      </MDBRow>
      {hasMore && (
        <div ref={loaderRef} className="loader">
          Загрузка...
        </div>
      )}
    </MDBContainer>
  );
}

export default ProductGrid;