import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBContainer, MDBInput, MDBBtn, MDBIcon, MDBSpinner } from 'mdb-react-ui-kit';
import api from '../../utils/api';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Пожалуйста, введите имя пользователя и пароль');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/admin/login', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Ошибка входа. Пожалуйста, попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MDBContainer className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card shadow-5" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body p-5">
          <h2 className="text-center mb-4">
            <MDBIcon icon="user-shield" className="me-2" />
            Вход в панель управления
          </h2>
          
          {error && (
            <div className="alert alert-danger">
              <MDBIcon icon="exclamation-triangle" className="me-2" />
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <MDBInput
                label="Имя пользователя"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="mb-4">
              <MDBInput
                label="Пароль"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
            <MDBBtn 
              type="submit" 
              color="primary" 
              className="w-100" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <MDBSpinner size="sm" className="me-2" />
                  Вход...
                </>
              ) : (
                <>
                  <MDBIcon icon="sign-in-alt" className="me-2" />
                  Войти
                </>
              )}
            </MDBBtn>
          </form>
        </div>
      </div>
    </MDBContainer>
  );
};

export default LoginForm;
