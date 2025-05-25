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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    discountPrice: '',
    weight: '',
    categoryId: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/admin/products'),
        api.get('/categories')
      ]);
      
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      setError('Ошибка при загрузке данных');
      console.error('Error fetching data:', error);
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
              Category: category 
            };
          }
          return { ...product, [field]: value };
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
      formData.append('categoryId', categoryId);
      
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

      await api.post('/admin/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Refresh products after update
      fetchProducts();
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
      formData.append('categoryId', newProduct.categoryId);
      
      if (newProduct.discountPrice) {
        formData.append('discountPrice', newProduct.discountPrice);
      }
      
      if (newProduct.image) {
        formData.append('image', newProduct.image);
      }

      await api.post('/admin/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Reset form and refresh products
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
      fetchProducts();
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <MDBSpinner color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3">
        <MDBIcon icon="exclamation-triangle" className="me-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Управление товарами</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
        >
          <MDBIcon icon="plus" className="me-2" />
          Добавить товар
        </button>
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
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <MDBTable hover>
              <MDBTableHead>
                <tr>
                  <th>ID</th>
                  <th>Изображение</th>
                  <th>Название</th>
                  <th>Цена</th>
                  <th>Цена со скидкой</th>
                  <th>Вес</th>
                  <th>Категория</th>
                  <th className="text-end">Действия</th>
                </tr>
              </MDBTableHead>
              <MDBTableBody>
                {products.map((product) => (
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
                      <div className="btn-group">
                        <MDBBtn 
                          color="success" 
                          size="sm" 
                          onClick={() => handleSave(product)}
                          title="Сохранить"
                        >
                          <MDBIcon icon="check" size="sm" />
                        </MDBBtn>
                        <MDBBtn 
                          color="danger" 
                          size="sm" 
                          onClick={() => handleDelete(product.id)}
                          title="Удалить"
                          className="ms-1"
                        >
                          <MDBIcon icon="trash" size="sm" />
                        </MDBBtn>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">
                      <MDBIcon icon="box-open" size="3x" className="mb-3 d-block mx-auto" />
                      Товары не найдены
                    </td>
                  </tr>
                )}
              </MDBTableBody>
            </MDBTable>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
