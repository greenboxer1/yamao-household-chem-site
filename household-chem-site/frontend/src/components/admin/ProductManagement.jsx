import React, { useState, useEffect } from 'react';
import { 
  MDBIcon, 
  MDBTable, 
  MDBTableHead, 
  MDBTableBody, 
  MDBBtn, 
  MDBInput, 
  MDBSelect, 
  MDBSpinner,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit';
import api from '../../utils/api';

const EditableField = ({ value, onChange, type = 'text', className = '' }) => {
  return (
    <input
      type={type}
      className={`form-control ${className}`}
      value={value || ''}
      onChange={onChange}
      style={{ minWidth: '80px' }}
    />
  );
};

const ProductManagement = () => {
  // Add custom styles
  const styles = `
    .table {
      font-size: 0.8125rem;
    }
    
    .table th, .table td {
      padding: 0.4rem 0.5rem;
    }
    
    .form-control, .form-select {
      font-size: 0.8125rem;
      padding: 0.2rem 0.4rem;
    }
    
    .btn {
      font-size: 0.8125rem;
      padding: 0.2rem 0.4rem;
    }
    
    .btn-sm {
      padding: 0.15rem 0.3rem;
    }
    
    .card-header {
      padding: 0.75rem 1rem;
    }
    
    .table-responsive {
      margin: 0 -0.5rem;
      padding: 0 0.5rem;
    }
    
    .editable-field {
      width: 100%;
      min-width: 100px;
    }
  `;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    discountPrice: '',
    weight: '',
    categoryId: '',
    image: null
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        (product.Category?.name?.toLowerCase().includes(searchLower) || '')
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/admin/products'),
        api.get('/categories')
      ]);
      const productsData = Array.isArray(productsRes.data) ? productsRes.data : [];
      setProducts(productsData);
      setFilteredProducts(productsData);
      setCategories(categoriesRes.data || []);
      setError('');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Ошибка при загрузке данных: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (id, field, value) => {
    setProducts(prev => 
      prev.map(product => {
        if (product.id === id) {
          // Special handling for category to update both categoryId and Category object
          if (field === 'categoryId') {
            const category = categories.find(c => c.id.toString() === value);
            return { 
              ...product, 
              categoryId: value,
              Category: category || product.Category // Preserve existing category if not found
            };
          }
          // For other fields, preserve all existing data including category
          return { 
            ...product, 
            [field]: value
            // Don't touch categoryId and Category to prevent them from being reset
          };
        }
        return product;
      })
    );
  };

  const handleNewProductChange = (field, value) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct(prev => ({
        ...prev,
        image: file
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (product) => {
    try {
      // Use CategoryId if categoryId is not available (for backward compatibility)
      const categoryId = product.categoryId || product.CategoryId;
      
      if (!categoryId) {
        setError('Пожалуйста, выберите категорию');
        return;
      }

      const formData = new FormData();
      formData.append('id', product.id);
      formData.append('name', product.name);
      formData.append('price', product.price);
      formData.append('weight', product.weight || '');
      // Используем CategoryId с большой буквы, как ожидает бэкенд
      formData.append('CategoryId', categoryId);
      
      if (product.discountPrice) {
        formData.append('discountPrice', product.discountPrice);
      }
      
      // Handle image only if it's a File object
      if (product.image && product.image instanceof File) {
        formData.append('image', product.image);
      } else if (product.image && typeof product.image === 'string') {
        // If it's a string (existing image path), include it as is
        formData.append('image', product.image);
      }

      const response = await api.post('/admin/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Update the local state with the updated product data from the server
      setProducts(prev => prev.map(p => {
        if (p.id === product.id) {
          // Find the category object from the categories list
          const category = categories.find(c => c.id === response.data.CategoryId || 
            (response.data.Category && c.id === response.data.Category.id));
          
          // Return updated product with the category
          return {
            ...p, // Keep existing properties
            ...response.data, // Update with server data
            Category: category || p.Category, // Preserve category if not found
            categoryId: response.data.CategoryId || (response.data.Category && response.data.Category.id) || p.categoryId
          };
        }
        return p;
      }));
      
      setError('');
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Ошибка при обновлении товара: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleAddProduct = async () => {
    try {
      if (!newProduct.categoryId) {
        setError('Пожалуйста, выберите категорию');
        return;
      }

      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('price', newProduct.price);
      formData.append('weight', newProduct.weight);
      // Используем CategoryId с большой буквы, как ожидает бэкенд
      formData.append('CategoryId', newProduct.categoryId);
      
      if (newProduct.discountPrice) {
        formData.append('discountPrice', newProduct.discountPrice);
      }
      
      if (newProduct.image) {
        formData.append('image', newProduct.image);
      }

      const response = await api.post('/admin/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Add the new product to the local state with the category
      const newProductWithCategory = {
        ...response.data,
        Category: categories.find(c => c.id === response.data.categoryId)
      };
      
      setProducts(prev => [...prev, newProductWithCategory]);
      
      // Reset form
      setNewProduct({
        name: '',
        price: '',
        discountPrice: '',
        weight: '',
        categoryId: '',
        image: null
      });
      setImagePreview('');
      setIsAdding(false);
      setError('');
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Ошибка при добавлении товара: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        await api.delete(`/admin/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Ошибка при удалении товара');
      }
    }
  };

  return (
    <div className="container-fluid p-0" style={{ '--bs-gutter-x': '0.5rem' }}>
      <style>{styles}</style>
      {/* Search Bar with Add Button */}
      <div className="card mb-4">
        <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-md-center">
          <h5 className="mb-3 mb-md-0">Управление товарами</h5>
          <div className="d-flex flex-column flex-md-row gap-2 w-100 w-md-auto">
            <div className="input-group" style={{ minWidth: '250px' }}>
              <span className="input-group-text">
                <MDBIcon icon="search" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Поиск по названию или категории..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="btn btn-outline-secondary" 
                  type="button"
                  onClick={() => setSearchTerm('')}
                >
                  <MDBIcon icon="times" />
                </button>
              )}
            </div>
            <button 
              className="btn btn-primary ms-md-2"
              onClick={() => setIsAdding(true)}
              disabled={isAdding}
            >
              <MDBIcon icon="plus" className="me-1" />
              Добавить товар
            </button>
          </div>
        </div>
      </div>

      {/* Add New Product Form */}
      {isAdding && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-4">Добавить новый товар</h5>
            <MDBRow>
              <MDBCol md={3}>
                <MDBInput
                  label="Название"
                  value={newProduct.name}
                  onChange={(e) => handleNewProductChange('name', e.target.value)}
                  required
                />
              </MDBCol>
              <MDBCol md={2}>
                <MDBInput
                  label="Вес"
                  value={newProduct.weight}
                  onChange={(e) => handleNewProductChange('weight', e.target.value)}
                  required
                />
              </MDBCol>
              <MDBCol md={2}>
                <label className="form-label">Цена</label>
                <input
                  type="number"
                  className="form-control mb-3"
                  value={newProduct.price}
                  onChange={(e) => handleNewProductChange('price', e.target.value)}
                  min="0"
                  step="0.01"
                />
              </MDBCol>
              <MDBCol md={2}>
                <label className="form-label">Цена со скидкой</label>
                <input
                  type="number"
                  className="form-control mb-3"
                  value={newProduct.discountPrice}
                  onChange={(e) => handleNewProductChange('discountPrice', e.target.value)}
                  min="0"
                  step="0.01"
                />
              </MDBCol>
              <MDBCol md={2}>
                <label className="form-label">Категория</label>
                <select
                  className="form-select mb-3"
                  value={newProduct.categoryId || ''}
                  onChange={(e) => handleNewProductChange('categoryId', e.target.value)}
                  required
                >
                  <option value="" disabled>Выберите категорию</option>
                  {categories.map(category => {
                    // Skip the 'Все' category in the dropdown
                    if (category.id === 'all') return null;
                    return (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    );
                  })}
                </select>
              </MDBCol>
              <MDBCol md={2}>
                <label className="form-label">Изображение</label>
                <input
                  type="file"
                  className="form-control mb-3"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </MDBCol>
              <MDBCol md={1} className="d-flex align-items-end">
                <MDBBtn color="success" onClick={handleAddProduct}>
                  <MDBIcon icon="check" />
                </MDBBtn>
                <MDBBtn color="light" className="ms-2" onClick={() => setIsAdding(false)}>
                  <MDBIcon icon="times" />
                </MDBBtn>
              </MDBCol>
            </MDBRow>
            {imagePreview && (
              <div className="mt-2">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ maxWidth: '100px', maxHeight: '100px' }}
                  className="img-thumbnail"
                />
              </div>
            )}
          </div>
        </div>
      )}



      {/* Products Table */}
      {loading ? (
        <div className="text-center my-5">
          <MDBSpinner className="me-2" />
          Загрузка...
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div className="table-responsive">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-4">
              {searchTerm ? 'Товары не найдены' : 'Нет доступных товаров'}
            </div>
          ) : (
            <MDBTable hover responsive className="align-middle">
              <MDBTableHead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Изображение</th>
                  <th style={{ minWidth: '200px' }}>Название</th>
                  <th>Цена</th>
                  <th>Цена со скидкой</th>
                  <th>Вес</th>
                  <th style={{ minWidth: '180px' }}>Категория</th>
                  <th className="text-end">Действия</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      {product.image && (
                        <img 
                          src={`/images/${product.image}`} 
                          alt={product.name}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          className="img-thumbnail"
                        />
                      )}
                    </td>
                    <td>
                      <EditableField
                        value={product.name}
                        onChange={(e) => handleInputChange(product.id, 'name', e.target.value)}
                      />
                    </td>
                    <td>
                      <EditableField
                        type="number"
                        value={product.price}
                        onChange={(e) => handleInputChange(product.id, 'price', e.target.value)}
                        className="text-end"
                      />
                    </td>
                    <td>
                      <EditableField
                        type="number"
                        value={product.discountPrice || ''}
                        onChange={(e) => handleInputChange(product.id, 'discountPrice', e.target.value || null)}
                        className="text-end"
                        placeholder="Нет скидки"
                      />
                    </td>
                    <td>
                      <EditableField
                        value={product.weight || ''}
                        onChange={(e) => handleInputChange(product.id, 'weight', e.target.value)}
                        required
                      />
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={product.Category?.id || product.categoryId || ''}
                        onChange={(e) => handleInputChange(product.id, 'categoryId', e.target.value)}
                        required
                        style={{ minWidth: '150px' }}
                      >
                        <option value="" disabled>Выберите категорию</option>
                        {categories.map(category => {
                          // Skip the 'Все' category in the dropdown
                          if (category.id === 'all') return null;
                          return (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm" role="group">
                        <button 
                          type="button"
                          className="btn btn-success"
                          onClick={() => handleSave(product)}
                          title="Сохранить"
                          style={{ width: '32px' }}
                        >
                          <MDBIcon icon="check" />
                        </button>
                        <button 
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleDelete(product.id)}
                          title="Удалить"
                          style={{ width: '32px' }}
                        >
                          <MDBIcon icon="trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
