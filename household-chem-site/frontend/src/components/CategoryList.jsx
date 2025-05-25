import { MDBListGroup, MDBListGroupItem, MDBInput, MDBInputGroup, MDBIcon } from 'mdb-react-ui-kit';
import { FaSearch } from 'react-icons/fa';

function CategoryList({ 
  categories, 
  selectedCategory, 
  setSelectedCategory, 
  priceFrom, 
  setPriceFrom, 
  priceTo, 
  setPriceTo, 
  sortOrder, 
  setSortOrder,
  searchQuery,
  setSearchQuery
}) {
  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    // Reset search when selecting a category
    setSearchQuery('');
  };
  const sortOptions = [
    { text: 'Сначала дешевые', value: 'asc' },
    { text: 'Сначала дорогие', value: 'desc' }
  ];

  return (
    <div className="p-4 bg-white shadow-sm rounded-3">
      <div className="mb-4">
        <h2 className="h4 fw-bold mb-3">Поиск</h2>
        <MDBInputGroup>
          <MDBInput 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Название товара..."
            className="mb-3"
          />
          <button className="btn btn-primary">
            <FaSearch />
          </button>
        </MDBInputGroup>
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
          <MDBInputGroup>
            <MDBInput
              type="number"
              value={priceFrom}
              onChange={e => setPriceFrom(e.target.value)}
              placeholder="От"
              min="0"
              step="0.01"
            />
            <span className="input-group-text">₽</span>
          </MDBInputGroup>
          <MDBInputGroup>
            <MDBInput
              type="number"
              value={priceTo}
              onChange={e => setPriceTo(e.target.value)}
              placeholder="До"
              min={priceFrom || 0}
              step="0.01"
            />
            <span className="input-group-text">₽</span>
          </MDBInputGroup>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="h5 fw-bold mb-3">Сортировка</h3>
        <select
          className="form-select"
          value={sortOrder}
          onChange={e => setSortOrder(e.target.value)}
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
}

export default CategoryList;