import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, Navigate } from 'react-router-dom';
import { 
  MDBNavbar, 
  MDBContainer, 
  MDBNavbarBrand, 
  MDBBtn, 
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarToggler,
  MDBCollapse,
  MDBSpinner
} from 'mdb-react-ui-kit';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import api from '../../utils/api';

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        
        // Use the existing /admin/me endpoint to verify the token
        await api.get('/admin/me');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/admin/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      navigate('/admin/login');
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <MDBSpinner color="primary" />
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return <Navigate to="/admin/login" replace />;
  }

  const currentPath = window.location.pathname;

  return (
    <div className="d-flex flex-column min-vh-100">
      <MDBNavbar expand="lg" light bgColor="light">
        <MDBContainer fluid>
          <MDBNavbarBrand tag={Link} to="/admin">
            <MDBIcon icon="user-shield" className="me-2" />
            Панель администратора
          </MDBNavbarBrand>
          <MDBNavbarToggler
            type="button"
            data-mdb-toggle="collapse"
            data-mdb-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <MDBIcon icon="bars" fas />
          </MDBNavbarToggler>
          <MDBCollapse navbar id="navbarNav">
            <MDBNavbarNav className="me-auto mb-2 mb-lg-0">
              <MDBNavbarItem>
                <MDBNavbarLink 
                  tag={Link}
                  to="/admin/products"
                  active={window.location.pathname.startsWith('/admin')}
                >
                  <MDBIcon icon="box" className="me-1" />
                  Управление товарами
                </MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarNav>
            <div className="d-flex">
              <MDBBtn color="danger" size="sm" onClick={handleLogout}>
                <MDBIcon fas icon="sign-out-alt" className="me-2" />
                Выйти
              </MDBBtn>
            </div>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>

      <MDBContainer fluid className="py-4 flex-grow-1">
        <Outlet />
      </MDBContainer>

      <footer className="bg-light py-3 mt-auto">
        <MDBContainer fluid>
          <div className="text-center text-muted">
            &copy; {new Date().getFullYear()} Панель управления
          </div>
        </MDBContainer>
      </footer>
    </div>
  );
};

export default AdminLayout;
