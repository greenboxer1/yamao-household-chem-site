import React, { useState } from 'react';
import api from '../../utils/api';
import './AdminCredentials.css'; // We'll create this for styling

const AdminCredentials = () => {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword && newPassword !== confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }
    if (newPassword && newPassword.length < 6) {
        setError('Пароль должен содержать не менее 6 символов.');
        return;
    }

    try {
      const payload = {};
      if (newUsername.trim() !== '') {
        payload.newUsername = newUsername.trim();
      }
      if (newPassword.trim() !== '') {
        payload.newPassword = newPassword.trim();
        payload.confirmPassword = confirmPassword.trim();
      }

      if (Object.keys(payload).length === 0) {
        setError('Необходимо указать новый логин или новый пароль.');
        return;
      }

      // The token will be added by the api instance's request interceptor
      // No need to manually get token or set Authorization header here
      const response = await api.put('/admin/credentials', payload);
      setMessage(response.data.message || 'Учетные данные успешно обновлены.');
      setNewUsername('');
      setNewPassword('');
      setConfirmPassword('');
      // Optionally, redirect or clear form
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при обновлении учетных данных.');
      console.error('Error updating credentials:', err);
    }
  };

  return (
    <div className="admin-credentials-container">
      <h2>Смена логина и пароля администратора</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="credentials-form">
        <div className="form-group">
          <label htmlFor="newUsername">Новый логин (оставьте пустым, если не меняете)</label>
          <input
            type="text"
            id="newUsername"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Новый логин"
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">Новый пароль (оставьте пустым, если не меняете)</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Новый пароль"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Подтвердите новый пароль</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Подтвердите новый пароль"
            disabled={!newPassword} // Disable if newPassword is empty
          />
        </div>
        <button type="submit" className="submit-button">Сохранить изменения</button>
      </form>
    </div>
  );
};

export default AdminCredentials;
