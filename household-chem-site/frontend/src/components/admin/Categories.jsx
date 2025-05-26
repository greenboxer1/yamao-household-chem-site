import React, { useState, useEffect } from 'react';
import { MDBIcon } from 'mdb-react-ui-kit';
import api from '../../utils/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/admin/categories');
      setCategories(response.data);
      setError('');
    } catch (err) {
      setError('Не удалось загрузить категории');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      await api.post('/admin/categories', { name: newCategory });
      setNewCategory('');
      fetchCategories();
    } catch (err) {
      console.error('Error creating category:', err);
      alert(err.response?.data?.error || 'Не удалось создать категорию');
    }
  };

  const handleInputChange = (id, value) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, name: value } : cat
    ));
  };

  const handleUpdateCategory = async (id) => {
    const category = categories.find(cat => cat.id === id);
    if (!category?.name?.trim()) return;

    try {
      await api.put(`/admin/categories/${id}`, { name: category.name });
    } catch (err) {
      console.error('Error updating category:', err);
      alert(err.response?.data?.error || 'Не удалось обновить категорию');
      // Revert on error
      fetchCategories();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) return;
    
    try {
      await api.delete(`/admin/categories/${id}`);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
      alert(err.response?.data?.error || 'Не удалось удалить категорию');
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 px-md-4 px-xxl-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Категории</h2>
      </div>

      {/* Create Category Form */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Добавить новую категорию</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleCreateCategory} className="d-flex">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Введите название категории"
                required
              />
              <button type="submit" className="btn btn-primary">
                <MDBIcon icon="plus" className="me-1" />
                Добавить
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Categories Table */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Список категорий</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th className="text-end">Действия</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={category.name || ''}
                        onChange={(e) => handleInputChange(category.id, e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdateCategory(category.id)}
                      />
                    </td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm" role="group">
                        <button 
                          type="button"
                          className="btn btn-success"
                          onClick={() => handleUpdateCategory(category.id)}
                          title="Сохранить"
                          style={{ width: '32px' }}
                        >
                          <MDBIcon icon="check" />
                        </button>
                        <button 
                          type="button"
                          className="btn btn-danger"
                          onClick={() => handleDelete(category.id)}
                          title="Удалить"
                          style={{ width: '32px' }}
                        >
                          <MDBIcon icon="trash" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-3">
                    Нет категорий
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Categories;
