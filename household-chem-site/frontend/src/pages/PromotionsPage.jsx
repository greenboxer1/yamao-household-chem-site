import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBIcon, MDBSpinner, MDBTypography } from 'mdb-react-ui-kit';
import api from '../utils/api'; 
import './PromotionsPage.css';
import PromotionsDiscountedProductList from '../components/PromotionsDiscountedProductList';

const PromotionsPage = () => {
  const [banners, setBanners] = useState({ banner1Url: null, banner2Url: null });
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [bannerError, setBannerError] = useState('');

  useEffect(() => {
    const fetchPromotionalBanners = async () => {
      setLoadingBanners(true);
      try {
        const response = await api.get('/promotional-banners');
        if (response.data && typeof response.data === 'object') {
          setBanners({
            banner1Url: response.data.banner1Url || null,
            banner2Url: response.data.banner2Url || null,
          });
        } else {
          setBanners({ banner1Url: null, banner2Url: null });
          console.warn('Данные о баннерах не в ожидаемом формате или отсутствуют:', response.data);
        }
        setBannerError('');
      } catch (err) {
        console.error('Ошибка загрузки промо-баннеров:', err);
        setBannerError('Не удалось загрузить промо-баннеры.');
        setBanners({ banner1Url: null, banner2Url: null }); 
      } finally {
        setLoadingBanners(false);
      }
    };

    fetchPromotionalBanners();
  }, []);

  return (
    <MDBContainer fluid className="promotions-page-container py-4">
      {/* The header "Акции и специальные предложения" was removed as per previous request in Checkpoint 2 if it was there. Or add one if desired. */}
      {/* <h2 className="text-center my-4">Акции и специальные предложения</h2> */}

      {loadingBanners && (
        <div className="text-center my-5">
          <MDBSpinner role='status'>
            <span className='visually-hidden'>Загрузка...</span>
          </MDBSpinner>
        </div>
      )}
      {bannerError && <MDBTypography note noteColor='danger' className='mt-3 mb-3 text-center'>{bannerError}</MDBTypography>}

      {!loadingBanners && !bannerError && (
        <MDBRow className="mb-4 promo-banners-row">
          {banners.banner1Url && (
            <MDBCol md={banners.banner2Url ? "6" : "12"} className="mb-3 mb-md-0 promo-banner-col">
              <img src={banners.banner1Url} alt="Promotional Banner 1" className="img-fluid promo-banner-image rounded-3" />
            </MDBCol>
          )}
          {banners.banner2Url && (
            <MDBCol md={banners.banner1Url ? "6" : "12"} className="promo-banner-col">
              <img src={banners.banner2Url} alt="Promotional Banner 2" className="img-fluid promo-banner-image rounded-3" />
            </MDBCol>
          )}
          {!banners.banner1Url && !banners.banner2Url && (
             <MDBCol md="12" className="text-center">
                <MDBTypography note noteColor='info'>Актуальные промо-баннеры скоро появятся!</MDBTypography>
             </MDBCol>
          )}
        </MDBRow>
      )}

      {/* Discounted Products Section */}
      <PromotionsDiscountedProductList />

      {/* Placeholder for New Products - to be implemented if needed based on memory */}
      {/* e.g., <NewProductList /> */}

    </MDBContainer>
  );
};

export default PromotionsPage;
