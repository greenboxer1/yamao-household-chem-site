import { useState, useEffect } from 'react';
import { MDBBtn, MDBTable, MDBTableHead, MDBTableBody, MDBIcon, MDBBadge } from 'mdb-react-ui-kit';
import ProductModal from './ProductModal';
import api from '../../utils/api';

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/admin/products'),
        api.get('/categories')
      ]);

      setProducts(productsRes.data);
      setCategories(categoriesRes.data.filter(cat => cat.id !== 'all')); // Remove 'All' category
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await api.delete(`/admin/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete product');
      console.error(err);
    }
  };

  const handleSave = async (productData) => {
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key !== 'imageFile' && productData[key] !== undefined) {
          formData.append(key, productData[key]);
        }
      });
      
      if (productData.imageFile) {
        formData.append('image', productData.imageFile);
      }

      if (productData.id) {
        await api.post('/admin/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await api.post('/admin/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      setShowModal(false);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Products</h2>
        <MDBBtn color="primary" onClick={() => {
          setEditingProduct(null);
          setShowModal(true);
        }}>
          <MDBIcon icon="plus" className="me-2" />
          Add Product
        </MDBBtn>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <MDBTable hover responsive>
        <MDBTableHead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Weight</th>
            <th>Actions</th>
          </tr>
        </MDBTableHead>
        <MDBTableBody>
          {products.map(product => (
            <tr key={product.id}>
              <td>
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    onError={(e) => e.target.src = '/images/placeholder.svg'}
                  />
                ) : (
                  <div style={{ width: '50px', height: '50px', backgroundColor: '#f8f9fa' }}></div>
                )}
              </td>
              <td>{product.name}</td>
              <td>{product.Category?.name || 'N/A'}</td>
              <td>
                {product.discountPrice ? (
                  <>
                    <span className="text-decoration-line-through text-muted me-2">${product.price}</span>
                    <span className="text-danger fw-bold">${product.discountPrice}</span>
                  </>
                ) : (
                  `$${product.price}`
                )}
              </td>
              <td>{product.weight}</td>
              <td>
                <MDBBtn 
                  color="link" 
                  size="sm" 
                  className="text-primary"
                  onClick={() => handleEdit(product)}
                >
                  <MDBIcon icon="edit" />
                </MDBBtn>
                <MDBBtn 
                  color="link" 
                  size="sm" 
                  className="text-danger"
                  onClick={() => handleDelete(product.id)}
                >
                  <MDBIcon icon="trash" />
                </MDBBtn>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>

      <ProductModal 
        show={showModal} 
        onClose={() => setShowModal(false)}
        onSave={handleSave}
        product={editingProduct}
        categories={categories}
      />
    </div>
  );
};

export default AdminProductList;
