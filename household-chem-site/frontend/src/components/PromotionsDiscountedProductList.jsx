import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import api from '../utils/api';
import ProductCard from './ProductCard';
import { MDBIcon, MDBTypography } from 'mdb-react-ui-kit';
import './PromotionsDiscountedProductList.css';

const PromotionsDiscountedProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const listRef = useRef(null);
  
  const [isActuallyScrollable, setIsActuallyScrollable] = useState(false);
  const [canActuallyScrollLeft, setCanActuallyScrollLeft] = useState(false);
  const [canActuallyScrollRight, setCanActuallyScrollRight] = useState(false);

  // State for drag scrolling
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);
  const DRAG_SPEED_MULTIPLIER = 1.5; // Adjust for desired drag speed

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get('/products?limit=50'); 
        const allProducts = response.data.products || response.data;
        
        if (!Array.isArray(allProducts)) {
            console.error('Fetched products is not an array:', allProducts);
            setError('Не удалось загрузить список товаров: неверный формат данных.');
            setProducts([]);
            return;
        }

        const discounted = allProducts.filter(
          (product) =>
            product.discountPrice &&
            parseFloat(product.discountPrice) > 0 &&
            parseFloat(product.discountPrice) < parseFloat(product.price)
        );
        setProducts(discounted);
        setError('');
      } catch (err) {
        console.error('Ошибка при загрузке товаров со скидкой:', err);
        setError('Не удалось загрузить товары со скидкой.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const updateScrollability = useCallback(() => {
    if (listRef.current) {
      const { scrollWidth, clientWidth, scrollLeft: currentScrollPos } = listRef.current;

      const scrollable = scrollWidth > clientWidth + 1; 
      setIsActuallyScrollable(scrollable);

      if (scrollable) {
        setCanActuallyScrollLeft(currentScrollPos > 0.5);
        setCanActuallyScrollRight(currentScrollPos < (scrollWidth - clientWidth - 0.5));
      } else {
        setCanActuallyScrollLeft(false);
        setCanActuallyScrollRight(false);
      }
    } else {
      setIsActuallyScrollable(false);
      setCanActuallyScrollLeft(false);
      setCanActuallyScrollRight(false);
    }
  }, [setIsActuallyScrollable, setCanActuallyScrollLeft, setCanActuallyScrollRight]); 

  useLayoutEffect(() => {
    if (!loading) {
        updateScrollability();
    }
  }, [products, loading, updateScrollability]);

  useEffect(() => {
    const handleResize = () => {
      updateScrollability();
    };

    let currentListRef = null; 

    if (!loading && listRef.current) {
      window.addEventListener('resize', handleResize);
      currentListRef = listRef.current;
      currentListRef.addEventListener('scroll', updateScrollability);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (currentListRef) {
        currentListRef.removeEventListener('scroll', updateScrollability);
      }
    };
  }, [loading, updateScrollability]); 


  // Mouse event handlers for drag scrolling
  const handleMouseDown = (e) => {
    if (!listRef.current) return;
    // Prevent drag on scrollbar itself or on interactive elements like buttons within cards if any
    if (e.target.closest('button, a')) return;
    // Check if the click is on the scrollbar itself for horizontal scroll
    const isScrollbarClick = e.clientX >= listRef.current.clientWidth + listRef.current.offsetLeft - 17; // 17px is a common scrollbar width
    if (isScrollbarClick && e.offsetY >= listRef.current.clientHeight - 17) return;


    setIsDragging(true);
    setStartX(e.pageX - listRef.current.offsetLeft);
    setScrollLeftStart(listRef.current.scrollLeft);
    listRef.current.classList.add('dragging-scroll');
    // Prevent text selection while dragging
    document.body.style.userSelect = 'none';
  };

  const handleMouseLeaveOrUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (listRef.current) {
      listRef.current.classList.remove('dragging-scroll');
    }
    document.body.style.userSelect = '';
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !listRef.current) return;
    e.preventDefault(); // Prevent default drag behavior (e.g., image dragging)
    const x = e.pageX - listRef.current.offsetLeft;
    const walk = (x - startX) * DRAG_SPEED_MULTIPLIER;
    listRef.current.scrollLeft = scrollLeftStart - walk;
    updateScrollability(); // Update arrows based on new scroll position
  };

  const scrollList = (direction) => {
    if (listRef.current) {
      const scrollAmount = listRef.current.clientWidth * 0.9;
      let newScrollPosition = listRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      const maxScroll = listRef.current.scrollWidth - listRef.current.clientWidth;
      newScrollPosition = Math.max(0, Math.min(newScrollPosition, maxScroll));
      
      listRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });
    }
  };

  if (loading && products.length === 0) { 
    return <div className="text-center p-5"><MDBIcon icon="spinner" spin size="3x" /></div>;
  }

  if (error) {
    return <MDBTypography note noteColor='danger' className='mt-3 mb-3 text-center'>{error}</MDBTypography>;
  }

  if (products.length === 0 && !loading) { 
    return <MDBTypography note noteColor='info' className='mt-3 mb-3 text-center'>В данный момент нет товаров со скидкой.</MDBTypography>;
  }

  return (
    <div className="discounted-products-container my-4">
      <h3 className="mb-4 text-center">Товары со скидкой</h3>
      <div className="horizontal-scroll-wrapper">
        {isActuallyScrollable && canActuallyScrollLeft && (
          <button onClick={() => scrollList('left')} className="scroll-arrow left-arrow">
            <MDBIcon fas icon="chevron-left" />
          </button>
        )}
        <div 
          className="products-list-horizontal"
          ref={listRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
        >
          {products.map((product) => (
            <div key={product.id} className="product-card-wrapper">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        {isActuallyScrollable && canActuallyScrollRight && (
          <button onClick={() => scrollList('right')} className="scroll-arrow right-arrow">
            <MDBIcon fas icon="chevron-right" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PromotionsDiscountedProductList;
