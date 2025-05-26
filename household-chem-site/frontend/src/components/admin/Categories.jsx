import React, { useState, useEffect } from 'react';
import { MDBIcon } from 'mdb-react-ui-kit';
import api from '../../utils/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/categories');
      setCategories(response.data);
    } catch (err) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (editingId) {
        await api.put(`/admin/categories/${editingId}`, { name: formData.name });
      } else {
        await api.post('/admin/categories', { name: formData.name });
      }
      setFormData({ name: '' });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      alert(err.response?.data?.error || 'Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name });
    setEditingId(category.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await api.delete(`/admin/categories/${id}`);
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      alert(err.response?.data?.error || 'Failed to delete category');
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

  return (
    <div className="container-fluid px-3 px-md-4 px-xxl-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Categories</h2>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header">
              <h5 className="mb-0">{editingId ? 'Edit Category' : 'Add New Category'}</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="categoryName" className="form-label">Category Name</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      id="categoryName"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter category name"
                      required
                    />
                    <button type="submit" className="btn btn-primary">
                      {editingId ? 'Update' : 'Add'}
                    </button>
                    {editingId && (
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setEditingId(null);
                          setFormData({ name: '' });
                        }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">All Categories</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <tr key={category.id}>
                        <td>{category.name}</td>
                        <td className="text-end">
                          <div className="btn-group">
                            <button
                              onClick={() => handleEdit(category)}
                              className="btn btn-sm btn-outline-primary"
                              title="Edit"
                            >
                              <MDBIcon icon="edit" size="sm" />
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="btn btn-sm btn-outline-danger"
                              title="Delete"
                            >
                              <MDBIcon icon="trash" size="sm" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center text-muted py-4">
                        <MDBIcon icon="folder-open" size="2x" className="mb-2" />
                        <p className="mb-0">No categories found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
