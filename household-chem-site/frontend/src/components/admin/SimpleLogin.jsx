import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const SimpleLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    console.log('SimpleLogin mounted');
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/login', { username, password });
      console.log('Login response:', response.data);
      navigate('/admin/products');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  // Simple inline styles
  const styles = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#f0f2f5',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif'
    },
    card: {
      width: '100%',
      maxWidth: '400px',
      padding: '30px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      boxSizing: 'border-box'
    },
    title: {
      textAlign: 'center',
      color: '#333',
      marginBottom: '25px',
      fontSize: '24px',
      fontWeight: 'bold'
    },
    inputGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#555',
      fontSize: '14px',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      border: '1px solid #ddd',
      borderRadius: '6px',
      fontSize: '16px',
      boxSizing: 'border-box',
      transition: 'border-color 0.3s',
      outline: 'none'
    },
    inputFocus: {
      borderColor: '#4a90e2',
      boxShadow: '0 0 0 2px rgba(74, 144, 226, 0.2)'
    },
    button: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#4a90e2',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      marginTop: '10px'
    },
    buttonHover: {
      backgroundColor: '#357abd'
    },
    buttonDisabled: {
      backgroundColor: '#a0c4f3',
      cursor: 'not-allowed'
    },
    error: {
      color: '#e74c3c',
      backgroundColor: '#fde8e8',
      padding: '12px',
      borderRadius: '6px',
      marginBottom: '20px',
      fontSize: '14px',
      textAlign: 'center'
    }
  };

  // Add hover effect for button
  const buttonStyle = {
    ...styles.button,
    ...(isLoading ? styles.buttonDisabled : {})
  };

  if (!isMounted) {
    return (
      <div style={styles.container}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Admin Panel</h1>
        
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
              disabled={isLoading}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
              disabled={isLoading}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            style={buttonStyle}
            onMouseOver={(e) => !isLoading && (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => !isLoading && (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SimpleLogin;
