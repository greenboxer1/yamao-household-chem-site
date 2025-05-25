import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const FilterContext = createContext();

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    selectedCategory: null,
    priceFrom: '',
    priceTo: '',
    sortOrder: '',
    searchQuery: '',
  });

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    ...filters,
    setSelectedCategory: (category) => 
      setFilters(prev => ({ ...prev, selectedCategory: category })),
    setPriceFrom: (price) => 
      setFilters(prev => ({ ...prev, priceFrom: price })),
    setPriceTo: (price) => 
      setFilters(prev => ({ ...prev, priceTo: price })),
    setSortOrder: (order) => 
      setFilters(prev => ({ ...prev, sortOrder: order })),
    setSearchQuery: (query) => 
      setFilters(prev => ({ ...prev, searchQuery: query })),
    resetFilters: () => 
      setFilters({
        selectedCategory: null,
        priceFrom: '',
        priceTo: '',
        sortOrder: '',
        searchQuery: '',
      }),
  }), [filters]);

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContext;
