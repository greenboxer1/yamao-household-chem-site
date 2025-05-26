import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom'; 
import { 
  MDBContainer, 
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBFooter,
  MDBListGroup,
  MDBListGroupItem,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarToggler,
  MDBCollapse,
  MDBBtn
} from 'mdb-react-ui-kit';
import logo from '../../images/logo.svg';
import styles from './MainLayout.module.css'; 

const MainLayout = ({ children, contactInfo }) => {
  const [openNavExternal, setOpenNavExternal] = useState(false); 
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    setOpenNavExternal(false);
  }, [location]);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleNavLinkClick = (path) => { 
    navigate(path);
    window.scrollTo(0, 0); 
    setOpenNavExternal(false); 
  };

  const navItems = [
    { path: '/', label: 'Акции', icon: 'percent' },
    { path: '/catalog', label: 'Каталог', icon: 'spray-can' },
    { path: '/stores', label: 'Магазины', icon: 'store' },
    { path: '/about', label: 'О нас', icon: 'info-circle' },
  ];

  return (
    <div className="d-flex flex-column min-vh-100">
      <MDBNavbar expand="lg" light className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ''} sticky-top`}>
        <MDBContainer className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <MDBNavbarBrand href="#" onClick={() => handleNavLinkClick('/')} className="d-flex align-items-center me-3">
              <img src={logo} alt="Yamao Logo" className={styles.navbarBrandLogo} />
              <span className={styles.navbarBrandText}>Yamao</span>
            </MDBNavbarBrand>
            
            <MDBNavbarToggler
              aria-controls="navbarCollapseContent"
              aria-expanded={openNavExternal}
              aria-label="Toggle navigation"
              onClick={() => setOpenNavExternal(!openNavExternal)}
              className="d-lg-none"
            />
            
            <MDBCollapse navbar id="navbarCollapseContent" show={openNavExternal}>
              <MDBNavbarNav className={`mb-2 mb-lg-0 ${styles.navbarNav} d-lg-flex align-items-center`}>
                  {navItems.map((item) => (
                      <MDBNavbarItem key={item.path}>
                        <NavLink 
                          to={item.path} 
                          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                          onClick={() => handleNavLinkClick(item.path)} 
                        >
                          {item.label}
                        </NavLink>
                      </MDBNavbarItem>
                  ))}
              </MDBNavbarNav>
            </MDBCollapse>
          </div>

          {/* Desktop Contact Info */}
          <div className={`${styles.headerContacts} d-none d-lg-flex align-items-center`}>
            <a href={`tel:${contactInfo.phone?.replace(/\s+/g, '')}`} className={`${styles.contactLink} ${styles.phoneLink} me-3`}>
              <MDBIcon fas icon="phone-alt" className="me-2" />
              <span>{contactInfo.phone}</span>
            </a>
            <a href={contactInfo.telegramUrl || "#!"} target="_blank" rel="noopener noreferrer" className={`${styles.contactLink} ${styles.telegramLink}`} aria-label="Telegram">
              <MDBIcon fab icon="telegram-plane" size="lg" />
            </a>
          </div>

          {/* Mobile Phone Button */}
          <div className={`${styles.phoneButtonContainerMobile} d-lg-none ms-auto`}>
            <MDBBtn tag="a" href={`tel:${contactInfo.phone?.replace(/\s+/g, '')}`} color="primary" size="sm" className={`${styles.phoneButtonMobile} text-nowrap`}>
              <MDBIcon fas icon="phone-alt" />
            </MDBBtn>
          </div>
        </MDBContainer>
      </MDBNavbar>

      <main className="flex-grow-1 py-4">
        <MDBContainer className="px-3 px-md-4 px-xxl-5">
          {children}
        </MDBContainer>
      </main>

      {/* Footer - Ensure text-center is applied consistently and remove text-lg-start */}
      <MDBFooter className={`${styles.footer} text-center mt-auto`}>
        <MDBContainer className="pt-4 pb-5 px-3 px-md-4 px-xxl-5">
          {/* Add justify-content-center to MDBRow if columns themselves need centering, but focusing on content within columns first */}
          <MDBRow className="g-4">
            <MDBCol lg="4" md="6" className="mb-4 mb-lg-0">
              <h5 className="text-uppercase fw-bold mb-4">Контакты</h5>
              <div className="d-flex flex-column">
                {/* Changed justify-content-lg-start to justify-content-center */}
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <MDBIcon icon="phone" className="me-2 text-primary" />
                  <a href={`tel:${contactInfo.phone?.replace(/\s+/g, '')}`} className={`text-dark text-decoration-none ${styles.footerLink}`}>{contactInfo.phone}</a>
                </div>
                {/* Changed justify-content-lg-start to justify-content-center */}
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <MDBIcon icon="envelope" className="me-2 text-primary" />
                  <a href={`mailto:${contactInfo.email}`} className={`text-dark text-decoration-none ${styles.footerLink}`}>{contactInfo.email}</a>
                </div>
              </div>
            </MDBCol>

            {/* Ensure MDBCol for Menu also has text-center if not inheriting */}
            <MDBCol lg="4" md="6" className="mb-4 mb-lg-0 text-center">
              <h5 className="text-uppercase fw-bold mb-4">Меню</h5>
              <MDBListGroup className="list-unstyled">
                {navItems.map(item => (
                  <MDBListGroupItem key={`footer-${item.path}`} className="border-0 bg-transparent p-0 mb-2">
                    <NavLink to={item.path} className={`text-dark text-decoration-none py-1 d-inline-block ${styles.footerLink}`}>
                      {item.label}
                    </NavLink>
                  </MDBListGroupItem>
                ))}
              </MDBListGroup>
            </MDBCol>

            <MDBCol lg="4" md="12" className="mb-4 mb-lg-0">
              <h5 className="text-uppercase fw-bold mb-4">Мы в соцсетях</h5>
              {/* Changed justify-content-lg-start to justify-content-center */}
              <div className="d-flex justify-content-center">
                <a href={contactInfo.vkUrl || "#!"} className={`text-dark me-3 ${styles.footerLink}`} target="_blank" rel="noopener noreferrer"><MDBIcon fab icon="vk" size="2x" /></a>
                <a href={contactInfo.telegramUrl || "#!"} className={`text-dark me-3 ${styles.footerLink}`} target="_blank" rel="noopener noreferrer"><MDBIcon fab icon="telegram-plane" size="2x" /></a>
                <a href={contactInfo.whatsappUrl || "#!"} className={`text-dark ${styles.footerLink}`} target="_blank" rel="noopener noreferrer"><MDBIcon fab icon="whatsapp" size="2x" /></a>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <div className="text-center p-3" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
          {new Date().getFullYear()} Yamao. Все права защищены.
        </div>
      </MDBFooter>
    </div>
  );
};

export default MainLayout;
