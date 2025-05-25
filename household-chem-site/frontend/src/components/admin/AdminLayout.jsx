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
      <MDBNavbar expand="lg" light bgColor="light" className="shadow-sm">
        <MDBContainer className="px-3 px-md-4 px-xxl-5">
          <MDBNavbarBrand tag={Link} to="/admin/products" className="fw-bold">
            <MDBIcon icon="user-shield" className="me-2" />
            Панель администратора
          </MDBNavbarBrand>
          
          <div className="d-flex align-items-center">
            <MDBBtn 
              color="outline-danger" 
              size="sm" 
              className="me-2 d-flex align-items-center"
              onClick={handleLogout}
            >
              <MDBIcon icon="sign-out-alt" className="me-1" />
              <span className="d-none d-md-inline">Выйти</span>
            </MDBBtn>
            
            <MDBNavbarToggler
              type="button"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
              onClick={() => setIsOpen(!isOpen)}
              className="border-0"
            >
              <MDBIcon icon={isOpen ? 'times' : 'bars'} />
            </MDBNavbarToggler>
          </div>
          
          <MDBCollapse navbar isOpen={isOpen} className="justify-content-end">
            <MDBNavbarNav className="mb-2 mb-lg-0">
              <MDBNavbarItem>
                <MDBNavbarLink active aria-current="page" tag={Link} to="/admin/products">
                  <MDBIcon icon="box" className="me-1" />
                  Товары
                </MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>

      <div className="flex-grow-1 py-4">
        <MDBContainer className="px-3 px-md-4 px-xxl-5">
          <Outlet />
        </MDBContainer>
      </div>

      <footer className="bg-light py-3 mt-auto">
        <MDBContainer className="px-3 px-md-4 px-xxl-5">
          <div className="text-center text-muted">
            &copy; {new Date().getFullYear()} Панель управления
          </div>
        </MDBContainer>
      </footer>
    </div>
  );
};

export default AdminLayout;
