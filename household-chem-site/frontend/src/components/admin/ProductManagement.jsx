import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [hoveredImage, setHoveredImage] = useState(null);
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 });
  const previewRef = useRef(null);
  const hoverTimeout = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (hoveredImage) {
      setPreviewPosition({
        x: e.clientX + 20,
        y: e.clientY + 20
      });
    }
  }, [hoveredImage]);

  useEffect(() => {
    const moveHandler = (e) => handleMouseMove(e);
    
    if (hoveredImage) {
      window.addEventListener('mousemove', moveHandler);
    }
    
    return () => {
      window.removeEventListener('mousemove', moveHandler);
      if (hoverTimeout.current) {
        clearTimeout(hoverTimeout.current);
      }
    };
  }, [hoveredImage, handleMouseMove]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    discountPrice: '',
    weight: '',
    categoryId: '',
    image: null
  });

  // Check if all required fields are filled
  const isFormValid = () => {
    return (
      newProduct.name.trim() !== '' &&
      newProduct.price !== '' &&
      newProduct.weight.trim() !== '' &&
      newProduct.categoryId !== ''
    );
  };
  // Form is always visible

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

  const handleInputChange = async (id, field, value) => {
    // First update the local state
    const updatedProducts = products.map(product => {
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
    });
    
    setProducts(updatedProducts);
    
    // Then save the changes to the server
    const productToUpdate = updatedProducts.find(p => p.id === id);
    if (productToUpdate) {
      try {
        const formData = new FormData();
        formData.append('id', productToUpdate.id);
        formData.append('name', productToUpdate.name);
        formData.append('price', productToUpdate.price);
        formData.append('weight', productToUpdate.weight || '');
        formData.append('CategoryId', productToUpdate.categoryId || productToUpdate.CategoryId);
        
        if (productToUpdate.discountPrice) {
          formData.append('discountPrice', productToUpdate.discountPrice);
        }
        
        // Handle image only if it's a File object
        if (productToUpdate.image && productToUpdate.image instanceof File) {
          formData.append('image', productToUpdate.image);
        } else if (productToUpdate.image && typeof productToUpdate.image === 'string') {
          formData.append('image', productToUpdate.image);
        }

        await api.post('/admin/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } catch (error) {
        console.error('Error updating product:', error);
        setError('Ошибка при обновлении товара: ' + (error.response?.data?.error || error.message));
        // Revert the changes on error
        fetchProducts();
      }
    }
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
      <h4 className="mb-4">Управление товарами</h4>
      
      {/* Add New Product Form */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Добавить новый товар</h5>
        </div>
        <div className="card-body p-4">
          <div className="d-flex flex-wrap align-items-end gap-3">
            <div style={{ width: '280px' }}>
              <MDBInput
                label="Название"
                value={newProduct.name}
                onChange={(e) => handleNewProductChange('name', e.target.value)}
                required
                className="mb-0"
                size="lg"
              />
            </div>
            
            <div style={{ width: '150px' }}>
              <MDBInput
                label="Вес"
                value={newProduct.weight}
                onChange={(e) => handleNewProductChange('weight', e.target.value)}
                required
                className="mb-0"
                size="lg"
              />
            </div>
            
            <div style={{ width: '150px' }}>
              <MDBInput
                label="Цена"
                type="number"
                value={newProduct.price}
                onChange={(e) => handleNewProductChange('price', e.target.value)}
                min="0"
                step="0.01"
                className="mb-0"
                size="lg"
              />
            </div>
            
            <div style={{ width: '180px' }}>
              <MDBInput
                label="Цена со скидкой"
                type="number"
                value={newProduct.discountPrice || ''}
                onChange={(e) => handleNewProductChange('discountPrice', e.target.value)}
                min="0"
                step="0.01"
                className="mb-0"
                size="lg"
              />
            </div>
            
            <div style={{ width: '220px' }}>
              <select
                className="form-select form-select-lg"
                value={newProduct.categoryId || ''}
                onChange={(e) => handleNewProductChange('categoryId', e.target.value)}
                required
                style={{ height: '42px' }}
              >
                <option value="" disabled>Выберите категорию</option>
                {categories.map(category => {
                  if (category.id === 'all') return null;
                  return (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  );
                })}
              </select>
            </div>
            
            <div style={{ width: '240px' }}>
              <input
                type="file"
                className="form-control form-control-lg"
                accept="image/*"
                onChange={handleImageChange}
                style={{ height: '42px', padding: '0.5rem 1rem' }}
              />
            </div>
            
            <div className="d-flex align-items-center" style={{ marginBottom: '2px' }}>
              <MDBBtn 
                color="success" 
                size="md"
                onClick={handleAddProduct}
                disabled={!isFormValid()}
                title={!isFormValid() ? 'Заполните все обязательные поля' : ''}
                className="me-2"
                style={{ height: '42px', width: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <MDBIcon icon="check" />
              </MDBBtn>
              <MDBBtn 
                color="light" 
                size="md"
                onClick={() => {
                  setImagePreview('');
                  setNewProduct({
                    name: '',
                    price: '',
                    discountPrice: '',
                    weight: '',
                    categoryId: '',
                    image: null
                  });
                }}
                style={{ height: '42px', width: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <MDBIcon icon="times" />
              </MDBBtn>
            </div>
            
            {imagePreview && (
              <div className="ms-2" style={{ width: '90px', height: '42px', overflow: 'hidden', borderRadius: '6px' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    borderRadius: '6px'
                  }}
                  className="border"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card mb-4">
        <div className="card-body p-3">
          <div className="input-group" style={{ maxWidth: '500px' }}>
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
        </div>
      </div>
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
            <MDBTable hover responsive className="align-middle" style={{ '--mdb-table-bg': 'transparent' }}>
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
                      {product.image ? (
                        <div
                          style={{
                            width: '100px',
                            height: '100px',
                            padding: '8px',
                            position: 'relative',
                            cursor: 'zoom-in'
                          }}
                          onMouseEnter={() => {
                            hoverTimeout.current = setTimeout(() => {
                              setHoveredImage(product.image);
                            }, 200);
                          }}
                          onMouseLeave={() => {
                            if (hoverTimeout.current) {
                              clearTimeout(hoverTimeout.current);
                            }
                            setHoveredImage(null);
                          }}
                        >
                          <img 
                            src={product.image} 
                            alt={product.name}
                            onLoad={(e) => {
                              console.log('Изображение загружено:', e.target.src);
                            }}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              borderRadius: '4px',
                              border: '1px solid #dee2e6'
                            }}
                            onError={(e) => {
                              console.error('Ошибка загрузки изображения:', product.image, e);
                              // Заменяем изображение на текст с ошибкой
                              const parent = e.target.parentNode;
                              parent.innerHTML = '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #dc3545; font-size: 12px; text-align: center; padding: 5px;">Ошибка загрузки изображения</div>';
                            }}
                          />
                        </div>
                      ) : (
                        <div style={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6c757d' }}>
                          Нет фото
                        </div>
                      )}
                    </td>
                    <td>
                      <EditableField
                        value={product.name}
                        onChange={(e) => handleInputChange(product.id, 'name', e.target.value)}
                        onBlur={() => handleSave(product)}
                      />
                    </td>
                    <td>
                      <EditableField
                        type="number"
                        value={product.price}
                        onChange={(e) => handleInputChange(product.id, 'price', e.target.value)}
                        onBlur={() => handleSave(product)}
                      />
                    </td>
                    <td>
                      <EditableField
                        type="number"
                        value={product.discountPrice || ''}
                        onChange={(e) => handleInputChange(product.id, 'discountPrice', e.target.value)}
                        onBlur={() => handleSave(product)}
                      />
                    </td>
                    <td>
                      <EditableField
                        value={product.weight || ''}
                        onChange={(e) => handleInputChange(product.id, 'weight', e.target.value)}
                        onBlur={() => handleSave(product)}
                      />
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={product.categoryId || (product.Category ? product.Category.id : '')}
                        onChange={(e) => {
                          handleInputChange(product.id, 'categoryId', e.target.value);
                          handleSave({ ...product, categoryId: e.target.value });
                        }}
                        style={{ minWidth: '120px' }}
                      >
                        <option value="">Выберите категорию</option>
                        {categories.map(category => {
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
                      <div className="d-flex justify-content-end gap-2">
                        <MDBBtn
                          color="danger"
                          size="sm"
                          floating
                          onClick={() => handleDelete(product.id)}
                          className="ms-2"
                        >
                          <MDBIcon icon="trash" size="sm" />
                        </MDBBtn>
                      </div>
                    </td>
                  </tr>
                ))}
              </MDBTableBody>
            </MDBTable>
          )}
        </div>
      )}
      
      {/* Image Preview Overlay */}
      {hoveredImage && (
        <div
          ref={previewRef}
          style={{
            position: 'fixed',
            left: `${previewPosition.x}px`,
            top: `${previewPosition.y}px`,
            zIndex: 9999,
            backgroundColor: 'white',
            padding: '8px',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            border: '1px solid #dee2e6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '100px',
            minHeight: '100px'
          }}
        >
          <img 
            src={hoveredImage}
            alt="Preview"
            style={{
              maxWidth: '400px',
              maxHeight: '400px',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              borderRadius: '4px',
              backgroundColor: 'white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            onError={(e) => {
              // Скрываем превью, если изображение не загрузилось
              setHoveredImage(null);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
