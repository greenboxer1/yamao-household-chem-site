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
  MDBBtn
} from 'mdb-react-ui-kit';
import logo from '../../images/logo.svg';
import styles from './MainLayout.module.css'; 

const MainLayout = ({ children, contactInfo }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    setMobileNavOpen(false); 
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
    setMobileNavOpen(false); 
  };

  const navItems = [
    { path: '/', label: 'Акции', icon: 'percent' }, 
    { path: '/catalog', label: 'Каталог', icon: 'spray-can' },
    { path: '/stores', label: 'Магазины', icon: 'store' },
    { path: '/about', label: 'О нас', icon: 'info-circle' },
  ];

  return (
    <div className="d-flex flex-column min-vh-100">
      <MDBNavbar light className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ''} sticky-top`}>
        <MDBContainer className={`${styles.navbarContainerFluid} px-3 px-md-4 px-xxl-5`}>
          
          <div className={`${styles.desktopNavContainer} d-none d-lg-flex justify-content-between align-items-center w-100`}>
            {/* This div groups logo, brand text, AND nav menu for unified alignment */}
            <div className="d-flex align-items-center"> 
              <img 
                src={logo} 
                alt="Yamao Logo" 
                className={`${styles.navbarBrandLogo} me-2`} 
                onClick={() => handleNavLinkClick('/')} 
                style={{cursor: 'pointer'}}
              />
              <span 
                className={`${styles.navbarBrandText} me-4`} 
                onClick={() => handleNavLinkClick('/')} 
                style={{cursor: 'pointer'}}
              >
                Yamao
              </span>
              
              <MDBNavbarNav className={`${styles.navbarNavDesktop} d-flex flex-row align-items-center`}>
                  {navItems.map((item) => (
                      <MDBNavbarItem key={item.path} className="me-3"> 
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
            </div>

            <div className={`${styles.headerContactsDesktop} d-flex align-items-center`}>
              <a href={`tel:${contactInfo.phone?.replace(/\s+/g, '')}`} className={`${styles.contactLink} ${styles.phoneLink} me-3`}>
                <MDBIcon fas icon="phone-alt" className="me-2" />
                <span>{contactInfo.phone}</span>
              </a>
              <a href={contactInfo.telegramUrl || "#!"} target="_blank" rel="noopener noreferrer" className={`${styles.contactLink} ${styles.telegramLink}`} aria-label="Telegram">
                <MDBIcon fab icon="telegram-plane" size="lg" />
              </a>
            </div>
          </div>

          <div className={`${styles.mobileNavContainer} d-lg-none d-flex justify-content-between align-items-center w-100`}>
            <MDBNavbarBrand href="#" onClick={() => handleNavLinkClick('/')} className="d-flex align-items-center">
              <img src={logo} alt="Yamao Logo" className={styles.navbarBrandLogo} />
              <span className={styles.navbarBrandText}>Yamao</span>
            </MDBNavbarBrand>
            
            <MDBNavbarToggler
              aria-controls="mobileNavbarCollapse"
              aria-expanded={mobileNavOpen}
              aria-label="Toggle navigation"
              onClick={() => {
                console.log('Mobile toggler clicked! Current mobileNavOpen:', mobileNavOpen, 'New state will be:', !mobileNavOpen);
                setMobileNavOpen(!mobileNavOpen);
              }}
              className={styles.mobileNavbarToggler} 
            >
              <MDBIcon icon='bars' fas />
            </MDBNavbarToggler>
          </div>

          <div 
            id="mobileNavbarContent" 
            className={`
              ${styles.mobileMenuWrapper} 
              ${mobileNavOpen ? styles.mobileMenuWrapperOpen : ''} 
              d-lg-none 
              w-100
            `}
          >
            <div className={styles.mobileMenu}> 
              <MDBNavbarNav className={`${styles.navbarNavMobile} flex-column p-3`}>
                  {navItems.map((item) => (
                      <MDBNavbarItem key={`mobile-${item.path}`} className="w-100 mb-1">
                        <NavLink 
                          to={item.path} 
                          className={({ isActive }) => `${styles.navLinkMobile} ${isActive ? styles.navLinkActiveMobile : ''} d-block p-2`}
                          onClick={() => handleNavLinkClick(item.path)} 
                        >
                          <MDBIcon fas icon={item.icon} className="me-2" /> {item.label}
                        </NavLink>
                      </MDBNavbarItem>
                  ))}
                  <MDBNavbarItem className="w-100 mt-3 pt-3 border-top">
                     <a href={`tel:${contactInfo.phone?.replace(/\s+/g, '')}`} className={`${styles.contactLinkMobile} d-block p-2`}>
                       <MDBIcon fas icon="phone-alt" className="me-2" />
                       <span>{contactInfo.phone}</span>
                     </a>
                  </MDBNavbarItem>
                  <MDBNavbarItem className="w-100">
                     <a href={`mailto:${contactInfo.email}`} className={`${styles.contactLinkMobile} d-block p-2`}>
                       <MDBIcon fas icon="envelope" className="me-2" />
                       <span>{contactInfo.email}</span>
                     </a>
                  </MDBNavbarItem>
                   <MDBNavbarItem className={`${styles.socialIconsMobileContainer} w-100 d-flex justify-content-around pt-3 mt-2`}>
                      <a href={contactInfo.vkUrl || "#!"} target="_blank" rel="noopener noreferrer" className={styles.socialIconMobile} aria-label="VK">
                          <MDBIcon fab icon="vk" size="lg" />
                      </a>
                      <a href={contactInfo.telegramUrl || "#!"} target="_blank" rel="noopener noreferrer" className={styles.socialIconMobile} aria-label="Telegram">
                          <MDBIcon fab icon="telegram-plane" size="lg" />
                      </a>
                      <a href={contactInfo.whatsappUrl || "#!"} target="_blank" rel="noopener noreferrer" className={styles.socialIconMobile} aria-label="WhatsApp">
                          <MDBIcon fab icon="whatsapp" size="lg" />
                      </a>
                  </MDBNavbarItem>
              </MDBNavbarNav>
            </div>
          </div>
        </MDBContainer>
      </MDBNavbar>

      <main className="flex-grow-1 py-4">
        <MDBContainer className="px-3 px-md-4 px-xxl-5">
          {children}
        </MDBContainer>
      </main>

      <MDBFooter className={`${styles.footer} text-center mt-auto`}>
        <MDBContainer className="pt-4 pb-5 px-3 px-md-4 px-xxl-5">
          <MDBRow className="g-4">
            <MDBCol lg="4" md="6" className="mb-4 mb-lg-0">
              <h5 className="text-uppercase fw-bold mb-4">Контакты</h5>
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <MDBIcon icon="phone" className="me-2 text-primary" />
                  <a href={`tel:${contactInfo.phone?.replace(/\s+/g, '')}`} className={`text-dark text-decoration-none ${styles.footerLink}`}>{contactInfo.phone}</a>
                </div>
                <div className="d-flex align-items-center justify-content-center mb-3">
                  <MDBIcon icon="envelope" className="me-2 text-primary" />
                  <a href={`mailto:${contactInfo.email}`} className={`text-dark text-decoration-none ${styles.footerLink}`}>{contactInfo.email}</a>
                </div>
              </div>
            </MDBCol>

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
