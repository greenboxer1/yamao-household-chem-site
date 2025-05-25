import { MDBListGroup, MDBListGroupItem, MDBInput, MDBInputGroup } from 'mdb-react-ui-kit';
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
    <div className="p-4 bg-white shadow-sm rounded-3" style={{ width: '100%' }}>
      <div className="mb-4">
        <h2 className="h4 fw-bold mb-3">Поиск</h2>
        <form onSubmit={handleSearch}>
          <MDBInputGroup className="mb-3">
            <MDBInput 
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Название товара..."
              className="py-2"
              style={{ height: '38px' }}
              autoComplete="off"
            />
            <button 
              type="submit" 
              className="btn btn-primary d-flex align-items-center"
              style={{
                height: '38px',
                lineHeight: '1',
                padding: '0.375rem 0.75rem'
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
      
      <h2 className="h4 fw-bold mb-3">Категории</h2>
      <MDBListGroup>
        {categories.map(category => (
          <MDBListGroupItem
            key={category.id}
            active={selectedCategory === (category.id === 'all' ? null : category.id)}
            onClick={() => handleCategorySelect(category.id === 'all' ? null : category.id)}
            className="cursor-pointer"
          >
            {category.name}
          </MDBListGroupItem>
        ))}
      </MDBListGroup>
      <div className="mt-4">
        <h3 className="h5 fw-bold mb-3">Фильтр по цене</h3>
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
                height: '38px',
                borderTopRightRadius: '0',
                borderBottomRightRadius: '0',
                borderRight: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'textfield',
                margin: 0
              }}
            />
            <span className="input-group-text bg-light" style={{
              borderLeft: 'none',
              display: 'flex',
              alignItems: 'center',
              padding: '0.375rem 0.75rem',
              height: '38px'
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
                height: '38px',
                borderTopRightRadius: '0',
                borderBottomRightRadius: '0',
                borderRight: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'textfield',
                margin: 0
              }}
            />
            <span className="input-group-text bg-light" style={{
              borderLeft: 'none',
              display: 'flex',
              alignItems: 'center',
              padding: '0.375rem 0.75rem',
              height: '38px'
            }}>₽</span>
          </MDBInputGroup>
        </div>
        {(priceFrom || priceTo) && (
          <button 
            onClick={() => {
              setPriceFrom('');
              setPriceTo('');
            }}
            className="btn btn-sm btn-outline-secondary w-100"
          >
            Сбросить фильтр цены
          </button>
        )}
      </div>
      <div className="mt-4">
        <h3 className="h5 fw-bold mb-3">Сортировка</h3>
        <select
          className="form-select"
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
          onFocus={(e) => e.target.blur()} // Prevent focus to avoid mobile keyboard
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