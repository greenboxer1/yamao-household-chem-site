import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  MDBContainer, 
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBFooter,
  MDBListGroup,
  MDBListGroupItem
} from 'mdb-react-ui-kit';
import logo from '../../images/logo.svg';

const MainLayout = ({ children }) => {
  const [showNav, setShowNav] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setShowNav(false);
  }, [location]);
  
  // Add scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu
  const closeMobileMenu = () => {
    setShowNav(false);
  };
  
  // Handle navigation
  const handleNavLinkClick = (e, path) => {
    e.preventDefault();
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <header className={`sticky-top bg-white ${isScrolled ? 'shadow-sm' : ''} w-100 py-2`}>
        <MDBContainer className="px-3 px-md-4 px-xxl-5">
          <div className="d-flex justify-content-between align-items-center">
            {/* Logo */}
            <Link to="/" className="text-decoration-none d-flex align-items-center">
              <img
                src={logo}
                alt="Yamao"
                className="me-2"
                style={{ height: '40px' }}
              />
              <span className="d-none d-md-inline fw-bold fs-5 text-dark">Yamao</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="d-none d-lg-flex align-items-center">
              <div className="d-flex gap-3 me-4">
                <Link 
                  to="/promotions" 
                  className="text-dark text-decoration-none px-3 py-2 rounded-3 d-flex align-items-center"
                  onClick={closeMobileMenu}
                >
                  <MDBIcon icon="percent" className="me-2" />
                  <span>Акции</span>
                </Link>
                <Link 
                  to="/catalog" 
                  className="text-dark text-decoration-none px-3 py-2 rounded-3 d-flex align-items-center"
                  onClick={closeMobileMenu}
                >
                  <MDBIcon icon="th-large" className="me-2" />
                  <span>Каталог</span>
                </Link>
                <Link 
                  to="/stores" 
                  className="text-dark text-decoration-none px-3 py-2 rounded-3 d-flex align-items-center"
                  onClick={closeMobileMenu}
                >
                  <MDBIcon icon="store" className="me-2" />
                  <span>Магазины</span>
                </Link>
                <Link 
                  to="/about" 
                  className="text-dark text-decoration-none px-3 py-2 rounded-3 d-flex align-items-center"
                  onClick={closeMobileMenu}
                >
                  <MDBIcon icon="info-circle" className="me-2" />
                  <span>О нас</span>
                </Link>
              </div>

              {/* Phone Number */}
              <a 
                href="tel:+71234567890" 
                className="btn btn-outline-primary d-flex align-items-center py-2 px-3 rounded-3 text-nowrap"
              >
                <MDBIcon icon="phone" className="me-2" />
                <span className="d-none d-xl-inline">+7 (123) 456-78-90</span>
                <span className="d-xl-none">Позвонить</span>
              </a>
            </nav>

            {/* Mobile Menu Toggle */}
            <button 
              className="btn p-2 d-lg-none border-0"
              onClick={() => setShowNav(!showNav)}
              aria-label="Меню"
            >
              <MDBIcon icon={showNav ? 'times' : 'bars'} size="lg" />
            </button>
          </div>

          {/* Mobile Menu */}
          {showNav && (
            <div className="d-lg-none mt-3 pt-3 border-top">
              <div className="d-flex flex-column gap-2">
                <Link 
                  to="/promotions" 
                  className="btn btn-outline-primary text-start px-3 py-2 rounded-3"
                  onClick={closeMobileMenu}
                >
                  <MDBIcon icon="percent" className="me-2" />
                  <span>Акции</span>
                </Link>
                <Link 
                  to="/catalog" 
                  className="btn btn-outline-primary text-start px-3 py-2 rounded-3"
                  onClick={closeMobileMenu}
                >
                  <MDBIcon icon="th-large" className="me-2" />
                  <span>Каталог</span>
                </Link>
                <Link 
                  to="/stores" 
                  className="btn btn-outline-primary text-start px-3 py-2 rounded-3"
                  onClick={closeMobileMenu}
                >
                  <MDBIcon icon="store" className="me-2" />
                  <span>Магазины</span>
                </Link>
                <Link 
                  to="/about" 
                  className="btn btn-outline-primary text-start px-3 py-2 rounded-3"
                  onClick={closeMobileMenu}
                >
                  <MDBIcon icon="info-circle" className="me-2" />
                  <span>О нас</span>
                </Link>
                <a 
                  href="tel:+71234567890" 
                  className="btn btn-outline-primary text-start px-3 py-2 rounded-3"
                >
                  <MDBIcon icon="phone" className="me-2" />
                  <span>+7 (123) 456-78-90</span>
                </a>
              </div>
            </div>
          )}
        </MDBContainer>
      </header>

      {/* Main Content */}
      <main className="flex-grow-1 py-4">
        <MDBContainer className="px-3 px-md-4 px-xxl-5">
          {children}
        </MDBContainer>
      </main>

      {/* Footer */}
      <MDBFooter className="bg-light text-center text-lg-start mt-auto">
        <MDBContainer className="py-5 px-3 px-md-4 px-xxl-5">
          <MDBRow className="g-4">
            <MDBCol lg="4" md="6" className="mb-4 mb-lg-0">
              <h5 className="text-uppercase fw-bold mb-4">Контакты</h5>
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center justify-content-center justify-content-lg-start mb-3">
                  <MDBIcon icon="phone" className="me-2 text-primary" />
                  <a href="tel:+71234567890" className="text-dark text-decoration-none">+7 (123) 456-78-90</a>
                </div>
                <div className="d-flex align-items-center justify-content-center justify-content-lg-start mb-3">
                  <MDBIcon icon="envelope" className="me-2 text-primary" />
                  <a href="mailto:info@yamao.ru" className="text-dark text-decoration-none">info@yamao.ru</a>
                </div>
              </div>
            </MDBCol>

            <MDBCol lg="4" md="6" className="mb-4 mb-lg-0">
              <h5 className="text-uppercase fw-bold mb-4">Меню</h5>
              <MDBListGroup className="list-unstyled">
                <MDBListGroupItem className="border-0 bg-transparent p-0 mb-2">
                  <Link to="/catalog" className="text-dark text-decoration-none hover-underline py-1 d-inline-block">
                    Каталог
                  </Link>
                </MDBListGroupItem>
                <MDBListGroupItem className="border-0 bg-transparent p-0 mb-2">
                  <Link to="/promotions" className="text-dark text-decoration-none hover-underline py-1 d-inline-block">
                    Акции
                  </Link>
                </MDBListGroupItem>
                <MDBListGroupItem className="border-0 bg-transparent p-0 mb-2">
                  <Link to="/stores" className="text-dark text-decoration-none hover-underline py-1 d-inline-block">
                    Магазины
                  </Link>
                </MDBListGroupItem>
                <MDBListGroupItem className="border-0 bg-transparent p-0">
                  <Link to="/about" className="text-dark text-decoration-none hover-underline py-1 d-inline-block">
                    О нас
                  </Link>
                </MDBListGroupItem>
              </MDBListGroup>
            </MDBCol>

              <MDBCol lg="4" md="12" className="mb-4 mb-lg-0">
                <h5 className="text-uppercase fw-bold mb-4">Мы в соцсетях</h5>
                <p className="mb-4">Подпишитесь на нас, чтобы быть в курсе акций и новинок</p>
                <div className="d-flex justify-content-center justify-content-lg-start">
                  <a href="#!" className="me-3 text-dark hover-scale d-inline-block" aria-label="Telegram">
                    <MDBIcon fab icon="telegram" size="2x" className="me-2" />
                  </a>
                  <a href="#!" className="text-dark hover-scale d-inline-block" aria-label="ВКонтакте">
                    <MDBIcon fab icon="vk" size="2x" />
                  </a>
                </div>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
      </MDBFooter>
      </div>
    );
  }
  
  export default MainLayout;
