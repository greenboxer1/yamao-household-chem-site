import React, { useState, useEffect, useRef } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBListGroup, MDBListGroupItem, MDBIcon } from 'mdb-react-ui-kit';
import { YMaps, Map, Placemark, ZoomControl, TypeSelector } from '@pbe/react-yandex-maps';
import './StoresPage.css';

// Sample store data with coordinates in St. Petersburg
const stores = [
  {
    id: 1,
    name: 'На Невском',
    address: 'Невский проспект, 15',
    phone: '+7 (812) 111-22-33',
    hours: 'Пн-Пт: 10:00-21:00, Сб-Вс: 12:00-20:00',
    coordinates: [59.9357, 30.3259],
  },
  {
    id: 2,
    name: 'На Литейном',
    address: 'Литейный проспект, 25',
    phone: '+7 (812) 222-33-44',
    hours: 'Пн-Пт: 10:00-21:00, Сб-Вс: 12:00-20:00',
    coordinates: [59.9375, 30.3464],
  },
  // Store removed as requested
  {
    id: 4,
    name: 'На Петроградской',
    address: 'Большой проспект П.С., 35',
    phone: '+7 (812) 444-55-66',
    hours: 'Пн-Пт: 10:00-21:00, Сб-Вс: 12:00-20:00',
    coordinates: [59.9607, 30.3022],
  },
  {
    id: 5,
    name: 'На Московском',
    address: 'Московский проспект, 150',
    phone: '+7 (812) 555-66-77',
    hours: 'Пн-Пт: 10:00-21:00, Сб-Вс: 12:00-20:00',
    coordinates: [59.8816, 30.3199],
  },
];

const StoresPage = () => {
  const [activeStore, setActiveStore] = useState(stores[0]);
  const [mapState, setMapState] = useState({
    center: stores[0].coordinates,
    zoom: 12,
    behaviors: ['default', 'scrollZoom'],
  });
  const mapRef = useRef(null);
  
  // Prevent default balloon behavior
  useEffect(() => {
    const disableBalloon = () => {
      const balloons = document.querySelectorAll('.ymaps-2-1-79-balloon');
      balloons.forEach(balloon => {
        balloon.style.display = 'none';
      });
    };
    
    // Run after the map is loaded
    const timer = setTimeout(disableBalloon, 1000);
    
    // Cleanup
    return () => clearTimeout(timer);
  }, []);

  const handleStoreClick = (store) => {
    setActiveStore(store);
    setMapState(prev => ({
      ...prev,
      center: store.coordinates,
      zoom: 15,
    }));
  };

  return (
    <div className="stores-page py-5">
      <MDBContainer>
        <h1 className="text-center mb-5">Наши магазины в Санкт-Петербурге</h1>
        
        <MDBRow>
          <MDBCol lg="5" className="mb-4 mb-lg-0">
            <div className="store-list-container">
              <h3 className="h4 mb-4">Выберите магазин</h3>
              <MDBListGroup className="store-list">
                {stores.map((store) => (
                  <MDBListGroupItem 
                    key={store.id}
                    className={`store-item ${activeStore.id === store.id ? 'active' : ''}`}
                    onClick={() => handleStoreClick(store)}
                  >
                    <div className="d-flex justify-content-between">
                      <div>
                        <h5 className="mb-1">{store.name}</h5>
                        <p className="mb-1 small">{store.address}</p>
                        <p className="mb-0 small text-muted">
                          <MDBIcon icon="clock" className="me-1" />
                          {store.hours}
                        </p>
                      </div>
                      <MDBIcon icon="chevron-right" className="mt-3" />
                    </div>
                  </MDBListGroupItem>
                ))}
              </MDBListGroup>
            </div>
          </MDBCol>
          
          <MDBCol lg="7">
            <div className="map-container rounded-4 overflow-hidden shadow-4">
              <YMaps query={{
                apikey: 'a9d3e6f5-3b9f-4e1d-8c7a-2b5d1e3f4a6b',
                lang: 'ru_RU',
                load: 'package.full',
              }}>
                <Map
                  instanceRef={mapRef}
                  state={mapState}
                  width="100%"
                  height="600px"
                  modules={['control.ZoomControl', 'control.TypeSelector']}
                  onLoad={(ymaps) => {
                    // Ensure ymaps and mapRef.current are available
                    // The 'scrollZoom' behavior is enabled by default if included in mapState.behaviors
                    // No need to explicitly disable or enable it here if mapState is set correctly.
                  }}
                >
                  {stores.map((store) => (
                    <Placemark
                      key={store.id}
                      geometry={store.coordinates}
                      options={{
                        preset: activeStore.id === store.id 
                          ? 'islands#darkBlueCircleDotIcon' 
                          : 'islands#darkBlueCircleIcon',
                        iconColor: activeStore.id === store.id ? '#0d6efd' : '#0d6efd',
                        hideIconOnBalloonOpen: false,
                        hasBalloon: false
                      }}
                      onClick={() => handleStoreClick(store)}
                      properties={{
                        hintContent: `
                          <div style="padding: 8px; max-width: 250px;">
                            <h5 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${store.name}</h5>
                            <p style="margin: 0 0 4px 0; font-size: 13px;">${store.address}</p>
                          </div>
                        `,
                      }}
                    />
                  ))}
                  <ZoomControl options={{ float: 'right' }} />
                  <TypeSelector options={{ float: 'right' }} />
                </Map>
              </YMaps>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default StoresPage;
