import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PromotionsPage.css'; // Assuming CSS is in the same folder or adjust path

const PromotionsPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // According to memory, API is /api/promotional-banners
        const response = await axios.get('/api/promotional-banners');
        // Assuming response.data is an array like [{ slot: 'slot1', imageUrl: 'url1', altText: 'alt1' }, ...]
        // Or it could be an object { slot1Url: '...', slot2Url: '...' }
        // For now, let's assume an array of objects with imageUrl and altText
        if (Array.isArray(response.data) && response.data.length > 0) {
          setBanners(response.data.slice(0, 2)); // Ensure we only take two banners
        } else if (typeof response.data === 'object' && response.data !== null && response.data.banner1Url && response.data.banner2Url) {
          // Handle object response if backend sends { banner1Url, banner2Url }
          setBanners([
            { slot: 'slot1', imageUrl: response.data.banner1Url, altText: 'Promotional Banner 1' },
            { slot: 'slot2', imageUrl: response.data.banner2Url, altText: 'Promotional Banner 2' },
          ]);
        } else {
          // Fallback if data is not as expected or empty
          // You might want to set default banners or handle this differently
          console.warn('No promotional banners found or data format is unexpected.');
          setBanners([]); 
        }
      } catch (err) {
        console.error('Error fetching promotional banners:', err);
        setError('Failed to load promotional banners. Please try again later.');
        // Set fallback banners if API fails
        setBanners([
          // Placeholder banners - replace with actual paths or remove if not desired
          // { slot: 'slot1', imageUrl: '/images/default_banner1.jpg', altText: 'Default Banner 1' },
          // { slot: 'slot2', imageUrl: '/images/default_banner2.jpg', altText: 'Default Banner 2' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) {
    return <div className="promotions-loading">Loading promotions...</div>;
  }

  if (error) {
    return <div className="promotions-error">{error}</div>;
  }

  return (
    <div className="promotions-page">
      {/* <h1 className="promotions-title">Special Promotions</h1> */}
      {banners.length > 0 ? (
        <div className="promotional-banners-container">
          {banners.map((banner, index) => (
            <div key={banner.slot || index} className="promotional-banner">
              <img src={banner.imageUrl} alt={banner.altText || `Promotional Banner ${index + 1}`} />
            </div>
          ))}
        </div>
      ) : (
        <p className="no-promotions-message">No current promotions available. Check back soon!</p>
      )}
      {/* DiscountedProductList and NewProductList will be added here later as per memory */}
    </div>
  );
};

export default PromotionsPage;
