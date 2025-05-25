import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MDBIcon } from 'mdb-react-ui-kit';
import api from '../../utils/api';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(product => product.id !== id));
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product');
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
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
        <h2 className="mb-0">Dashboard</h2>
        <Link to="/admin/products/new" className="btn btn-primary">
          <MDBIcon icon="plus" className="me-2" />
          Add New Product
        </Link>
      </div>
      
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title text-muted">Total Products</h5>
              <h2 className="mb-0">{products.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title text-muted">Categories</h5>
              <h2 className="mb-0">
                {[...new Set(products.map(p => p.Category?.name))].filter(Boolean).length}
              </h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title text-muted">Avg. Price</h5>
              <h2 className="mb-0">
                ${(products.reduce((sum, p) => sum + p.price, 0) / (products.length || 1)).toFixed(2)}
              </h2>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Recent Products</h5>
          <Link to="/admin/products" className="btn btn-sm btn-outline-primary">
            View All
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    {product.image && (
                      <img 
                        src={`/images/${product.image}`} 
                        alt={product.name} 
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.Category?.name || 'No Category'}</td>
                  <td className="text-end">
                    <div className="btn-group">
                      <Link 
                        to={`/admin/products/edit/${product.id}`}
                        className="btn btn-sm btn-outline-primary"
                        title="Edit"
                      >
                        <MDBIcon icon="edit" size="sm" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="btn btn-sm btn-outline-danger"
                        title="Delete"
                      >
                        <MDBIcon icon="trash" size="sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-4 text-muted">
            <MDBIcon icon="box-open" size="3x" className="mb-3" />
            <p className="mb-0">No products found. Add your first product to get started.</p>
          </div>
        )}
        
        <div className="card-footer text-muted">
          Showing {products.length} products
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
