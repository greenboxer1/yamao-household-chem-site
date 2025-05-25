import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../utils/api';

// Simple inline styles for debugging
const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8f9fa',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    marginBottom: '15px',
    textAlign: 'center'
  }
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    console.log('AdminLogin component mounted');
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      console.log('Attempting login with:', { username });
      const response = await api.post('/admin/login', { username, password });
      
      if (!isMounted) return;
      
      console.log('Login successful, token received');
      localStorage.setItem('token', response.data.token);
      
      // Redirect to the intended URL or default to /admin/products
      const from = location.state?.from?.pathname || '/admin/products';
      console.log('Redirecting to:', from);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      if (!isMounted) return;
      
      const errorMessage = err.response?.data?.error || 
                         err.message || 
                         'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  console.log('Rendering AdminLogin');
  
  if (!isMounted) {
    return <div style={styles.container}>
      <div>Loading...</div>
    </div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Login</h2>
        
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            style={styles.button}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
