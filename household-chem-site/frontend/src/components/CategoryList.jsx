import { MDBListGroup, MDBListGroupItem, MDBInput, MDBInputGroup, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { FaSearch } from 'react-icons/fa';
import { memo, useCallback, useRef } from 'react';
import { useFilter } from '../context/FilterContext';

const CategoryList = memo(({ categories }) => {
  const {
    selectedCategory,
    priceFrom,
    priceTo,
    sortOrder,
    searchQuery,
    setSelectedCategory,
    setPriceFrom,
    setPriceTo,
    setSortOrder,
    setSearchQuery
  } = useFilter();
  // Refs for inputs
  const searchInputRef = useRef(null);
  const priceFromRef = useRef(null);
  const priceToRef = useRef(null);

  // Memoized handlers
  const handleCategorySelect = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    // Reset search when selecting a category
    setSearchQuery('');
  }, [setSelectedCategory, setSearchQuery]);

  const sortOptions = [
    { text: 'Сначала дешевые', value: 'asc' },
    { text: 'Сначала дорогие', value: 'desc' }
  ];

  // Memoized search handler
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    // Clear category when searching
    setSelectedCategory(null);
  }, [setSelectedCategory]);

  return (
    <div className="bg-white shadow-sm rounded-3 h-100 w-100" style={{ 
      overflowY: 'auto',
      padding: '1.5rem 1.25rem'
    }}>
      <div className="mb-3">
        <h2 className="h5 fw-bold mb-3">Поиск</h2>
        <form onSubmit={handleSearch}>
          <MDBInputGroup className="mb-0">
            <MDBInput 
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Название товара..."
              className="py-2"
              style={{ height: '45px', fontSize: '1rem' }}
              autoComplete="off"
            />
            <button 
              type="submit" 
              className="btn btn-primary d-flex align-items-center"
              style={{
                height: '45px',
                lineHeight: '1.5',
                padding: '0.5rem 1rem',
                fontSize: '1rem'
              }}
              onClick={(e) => {
                e.preventDefault();
                handleSearch(e);
                searchInputRef.current?.focus();
              }}
            >
              <FaSearch className="fs-6" />
            </button>
          </MDBInputGroup>
        </form>
      </div>
      
      {/* Separator */}
      <hr className="my-4" />
      
      <div className="mb-4" style={{ paddingTop: '0.5rem' }}>
        <h3 className="h5 fw-bold mb-3">Категории</h3>
        <div className="d-flex flex-column gap-1">
          <div 
            className={`py-1 small ${!selectedCategory ? 'fw-semibold' : ''}`}
            onClick={() => handleCategorySelect(null)}
            style={{ 
              cursor: 'pointer',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale'
            }}
          >
            Все категории
          </div>
          {categories.map((category) => (
            <div 
              key={category.id}
              className={`py-1 small ${selectedCategory === category.id ? 'fw-semibold' : ''}`}
              onClick={() => handleCategorySelect(category.id)}
              style={{ 
                cursor: 'pointer',
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale'
              }}
            >
              {category.name}
            </div>
          ))}
        </div>
      </div>
      
      {/* Разделитель */}
      <hr className="my-4" />
      
      <div className="mb-4" style={{ paddingTop: '0.5rem' }}>
        <h3 className="h5 fw-bold mb-2">Фильтр по цене</h3>
        <div className="d-flex gap-2 mb-3">
          <MDBInputGroup className="flex-grow-1">
            <MDBInput
              ref={priceFromRef}
              type="text"
              inputMode="decimal"
              value={priceFrom}
              onChange={e => {
                const value = e.target.value;
                // Allow only numbers and decimal point
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  setPriceFrom(value);
                }
              }}
              placeholder="От"
              className="py-2"
              style={{ 
                height: '45px',
                fontSize: '1rem',
                borderTopRightRadius: '0',
                borderBottomRightRadius: '0',
                borderRight: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'textfield',
                margin: 0,
                padding: '0.5rem 0.75rem'
              }}
            />
            <span className="input-group-text bg-light" style={{
              borderLeft: 'none',
              display: 'flex',
              alignItems: 'center',
              padding: '0 0.75rem',
              height: '45px',
              fontSize: '1rem'
            }}>₽</span>
          </MDBInputGroup>
          
          <MDBInputGroup className="flex-grow-1">
            <MDBInput
              ref={priceToRef}
              type="text"
              inputMode="decimal"
              value={priceTo}
              onChange={e => {
                const value = e.target.value;
                // Allow only numbers and decimal point
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                  setPriceTo(value);
                }
              }}
              placeholder="До"
              className="py-2"
              style={{ 
                height: '45px',
                fontSize: '1rem',
                borderTopRightRadius: '0',
                borderBottomRightRadius: '0',
                borderRight: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'textfield',
                margin: 0,
                padding: '0.5rem 0.75rem'
              }}
            />
            <span className="input-group-text bg-light" style={{
              borderLeft: 'none',
              display: 'flex',
              alignItems: 'center',
              padding: '0 0.75rem',
              height: '45px',
              fontSize: '1rem'
            }}>₽</span>
          </MDBInputGroup>
        </div>
        
        {(priceFrom || priceTo) && (
          <button 
            onClick={() => {
              setPriceFrom('');
              setPriceTo('');
            }}
            className="btn btn-outline-secondary w-100 mt-3"
            style={{ padding: '0.5rem 0.75rem' }}
          >
            Сбросить фильтр цены
          </button>
        )}
      </div>
      
      <div style={{ paddingTop: '0.5rem' }}>
        <h3 className="h5 fw-bold mb-2">Сортировка</h3>
        <select
          className="form-select py-2"
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          onFocus={(e) => e.target.blur()} // Prevent focus to avoid mobile keyboard
          style={{ minHeight: '45px', fontSize: '1rem' }}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
});

CategoryList.displayName = 'CategoryList';

export default CategoryList;
