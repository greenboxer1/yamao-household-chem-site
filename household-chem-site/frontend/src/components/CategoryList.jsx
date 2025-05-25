import { MDBListGroup, MDBListGroupItem, MDBInputGroup } from 'mdb-react-ui-kit';

function CategoryList({ categories, selectedCategory, setSelectedCategory, priceFrom, setPriceFrom, priceTo, setPriceTo, sortOrder, setSortOrder }) {
  const sortOptions = [
    { text: 'По умолчанию', value: '' },
    { text: 'Сначала дешевые', value: 'asc' },
    { text: 'Сначала дорогие', value: 'desc' }
  ];

  return (
    <div className="p-4 bg-white shadow-sm rounded-3">
      <h2 className="h4 fw-bold mb-4">Категории</h2>
      <MDBListGroup>
        {categories.map(cat => (
          <MDBListGroupItem
            key={cat.id}
            active={selectedCategory === cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className="cursor-pointer"
          >
            {cat.name}
          </MDBListGroupItem>
        ))}
      </MDBListGroup>
      <div className="mt-4">
        <h3 className="h5 fw-bold mb-3">Фильтр по цене</h3>
        <MDBInputGroup
          type="number"
          value={priceFrom}
          onChange={e => setPriceFrom(e.target.value)}
          placeholder="От"
          prepend="₽"
          className="mb-3"
        />
        <MDBInputGroup
          type="number"
          value={priceTo}
          onChange={e => setPriceTo(e.target.value)}
          placeholder="До"
          prepend="₽"
        />
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