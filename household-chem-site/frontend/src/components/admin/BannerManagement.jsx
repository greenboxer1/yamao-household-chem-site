import React, { useState, useEffect, useRef } from 'react';
import {
  MDBBtn,
  MDBIcon,
  MDBSpinner,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit';
import api from '../../utils/api';
import './BannerManagement.css';

const BannerManagement = () => {
  const [currentBanner1Url, setCurrentBanner1Url] = useState('');
  const [currentBanner2Url, setCurrentBanner2Url] = useState('');

  const [loadingSlot1, setLoadingSlot1] = useState(false);
  const [loadingSlot2, setLoadingSlot2] = useState(false);
  const [loadingCurrent, setLoadingCurrent] = useState(true);

  const [error, setError] = useState('');

  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);

  const fetchCurrentBanners = async () => {
    setLoadingCurrent(true);
    try {
      const response = await api.get('/promotional-banners');
      if (response.data && typeof response.data === 'object'){
        setCurrentBanner1Url(response.data.banner1Url || '');
        setCurrentBanner2Url(response.data.banner2Url || '');
      }
      setError('');
    } catch (err) {
      console.error('Ошибка загрузки текущих баннеров:', err);
      setError('Не удалось загрузить текущие баннеры.');
    } finally {
      setLoadingCurrent(false);
    }
  };

  useEffect(() => {
    fetchCurrentBanners();
  }, []);

  const handleFileChange = async (slot, event) => {
    const file = event.target.files[0];
    if (file) {
      setError(''); 
      await handleSubmit(slot, file);
      if (slot === 'slot1' && fileInputRef1.current) fileInputRef1.current.value = null;
      if (slot === 'slot2' && fileInputRef2.current) fileInputRef2.current.value = null;
    }
  };

  const handleSubmit = async (slot, fileToUpload) => { 
    let setLoadingState;
    let endpoint;
    let bannerName;
    let setCurrentBannerUrl;

    if (!fileToUpload) { 
        setError('Файл не выбран.');
        return;
    }

    if (slot === 'slot1') {
      setLoadingState = setLoadingSlot1;
      endpoint = '/admin/promotional-banners/upload/slot1';
      bannerName = 'Левый баннер';
      setCurrentBannerUrl = setCurrentBanner1Url;
    } else if (slot === 'slot2') {
      setLoadingState = setLoadingSlot2;
      endpoint = '/admin/promotional-banners/upload/slot2';
      bannerName = 'Правый баннер';
      setCurrentBannerUrl = setCurrentBanner2Url;
    } else {
        setError('Неизвестный слот для загрузки.');
        return;
    }

    setLoadingState(true);
    setError('');

    const formData = new FormData();
    formData.append('bannerImage', fileToUpload);

    try {
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setCurrentBannerUrl(response.data.imageUrl);
    } catch (err) {
      console.error(`Ошибка загрузки ${bannerName}:`, err);
      setError(`Не удалось загрузить ${bannerName}. ${err.response?.data?.message || err.message || 'Произошла ошибка'}`);
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="banner-management-container p-4">
      <h2 className="mb-4">Управление промо-баннерами</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <MDBRow>
        {/* Slot 1 Management */} 
        <MDBCol md="6" className="banner-slot-col">
          <div className="banner-slot-manager p-3 border rounded">
            <h5 className="mb-3">Левый баннер</h5>

            <div className="image-and-chooser-container mb-3">
              <div className="text-center image-display-area mb-2">
                {loadingCurrent && !currentBanner1Url ? (
                    <MDBSpinner size="sm" role="status" tag="span" />
                ) : currentBanner1Url ? (
                  <img src={currentBanner1Url} alt="Текущий левый баннер" className="img-preview img-fluid" />
                ) : (
                  <div className="placeholder-preview">
                    <MDBIcon far icon="image" size="3x" className="text-muted" />
                    <p className="text-muted mt-2 small">Баннер не установлен</p>
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef1}
                onChange={(e) => handleFileChange('slot1', e)} 
                style={{ display: 'none' }}
                accept="image/*"
                id={`file-input-slot1-${Date.now()}`}
                disabled={loadingSlot1} 
              />
              <MDBBtn
                color="primary" 
                onClick={() => !loadingSlot1 && fileInputRef1.current.click()} 
                className="w-100 mt-auto" 
                disabled={loadingSlot1 || loadingCurrent} 
              >
                {loadingSlot1 ? (
                  <MDBSpinner size="sm" role="status" tag="span" className="me-2" />
                ) : (
                  <MDBIcon fas icon="file-upload" className="me-2" />
                )}
                Заменить Левый Баннер
              </MDBBtn>
            </div>
          </div>
        </MDBCol>

        {/* Slot 2 Management */} 
        <MDBCol md="6" className="banner-slot-col">
          <div className="banner-slot-manager p-3 border rounded">
            <h5 className="mb-3">Правый баннер</h5>

            <div className="image-and-chooser-container mb-3">
              <div className="text-center image-display-area mb-2">
                 {loadingCurrent && !currentBanner2Url ? (
                    <MDBSpinner size="sm" role="status" tag="span" />
                ) : currentBanner2Url ? (
                  <img src={currentBanner2Url} alt="Текущий правый баннер" className="img-preview img-fluid" />
                ) : (
                  <div className="placeholder-preview">
                    <MDBIcon far icon="image" size="3x" className="text-muted" />
                    <p className="text-muted mt-2 small">Баннер не установлен</p>
                  </div>
                )}
              </div>

              <input
                type="file"
                ref={fileInputRef2}
                onChange={(e) => handleFileChange('slot2', e)} 
                style={{ display: 'none' }}
                accept="image/*"
                id={`file-input-slot2-${Date.now()}`}
                disabled={loadingSlot2} 
              />
              <MDBBtn
                color="primary"
                onClick={() => !loadingSlot2 && fileInputRef2.current.click()} 
                className="w-100 mt-auto" 
                disabled={loadingSlot2 || loadingCurrent} 
              >
                {loadingSlot2 ? (
                  <MDBSpinner size="sm" role="status" tag="span" className="me-2" />
                ) : (
                  <MDBIcon fas icon="file-upload" className="me-2" />
                )}
                Заменить Правый Баннер
              </MDBBtn>
            </div>
          </div>
        </MDBCol>
      </MDBRow>
    </div>
  );
};

export default BannerManagement;
