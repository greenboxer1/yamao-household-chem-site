import React from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="about-page py-5">
      <MDBContainer>
        {/* Hero Section */}
        <section className="text-center mb-5">
          <h1 className="display-5 fw-bold mb-4">Сеть магазинов Yamao</h1>
          <p className="lead text-muted">
            Более 10 лет с вами. Качественная бытовая химия по лучшим ценам
          </p>
        </section>

        {/* About Section */}
        <section className="mb-5">
          <MDBRow className="align-items-center">
            <MDBCol lg="6" className="mb-4 mb-lg-0">
              <div className="bg-light p-5 rounded-4 text-center h-100">
                <MDBIcon icon="store" size="3x" className="text-primary mb-4" />
                <h3>Наши магазины</h3>
                <p className="mt-3">
                  Приглашаем вас посетить наши магазины, где вы найдете широкий ассортимент 
                  бытовой химии по выгодным ценам. Наш сайт поможет вам заранее узнать 
                  актуальные цены и наличие товаров.
                </p>
                <Link to="/stores" className="btn btn-primary mt-3">
                  <MDBIcon icon="map-marker-alt" className="me-2" />
                  Адреса магазинов
                </Link>
              </div>
            </MDBCol>
            <MDBCol lg="6">
              <h2 className="h3 fw-bold mb-4">О нашей сети</h2>
              <p className="mb-4">
                <strong>С 2010 года</strong> сеть магазинов Yamao предлагает покупателям 
                качественную бытовую химию по доступным ценам. Мы работаем напрямую с производителями, 
                что позволяет нам поддерживать выгодные цены для наших клиентов.
              </p>
              <p className="mb-4">
                <strong>Наш сайт</strong> создан для вашего удобства — здесь вы можете:
              </p>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <MDBIcon icon="check" className="text-success me-2" />
                  Узнать актуальные цены на товары
                </li>
                <li className="mb-2">
                  <MDBIcon icon="check" className="text-success me-2" />
                  Проверить наличие товаров в магазинах
                </li>
                <li className="mb-2">
                  <MDBIcon icon="check" className="text-success me-2" />
                  Найти ближайший магазин
                </li>
                <li>
                  <MDBIcon icon="check" className="text-success me-2" />
                  Ознакомиться с акциями и специальными предложениями
                </li>
              </ul>
              <p className="mt-4 mb-0">
                <strong>Обратите внимание:</strong> мы не осуществляем онлайн-продажи. 
                Все покупки совершаются только в наших розничных магазинах.
              </p>
            </MDBCol>
          </MDBRow>
        </section>

        {/* Features Section */}
        <section className="py-5">
          <h2 className="text-center mb-5">Наши преимущества</h2>
          <MDBRow className="g-4">
            <MDBCol md="4" className="text-center">
              <div className="p-4 bg-light rounded-4 h-100">
                <div 
                  className="bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{ width: '4rem', height: '4rem' }}
                >
                  <MDBIcon icon="award" size="2x" className="text-white" />
                </div>
                <h4>Качество</h4>
                <p>Только оригинальная продукция от ведущих производителей бытовой химии</p>
              </div>
            </MDBCol>
            <MDBCol md="4" className="text-center">
              <div className="p-4 bg-light rounded-4 h-100">
                <div 
                  className="bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{ width: '4rem', height: '4rem' }}
                >
                  <MDBIcon icon="tags" size="2x" className="text-white" />
                </div>
                <h4>Доступные цены</h4>
                <p>Гибкая ценовая политика и регулярные акции для наших покупателей</p>
              </div>
            </MDBCol>
            <MDBCol md="4" className="text-center">
              <div className="p-4 bg-light rounded-4 h-100">
                <div 
                  className="bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                  style={{ width: '4rem', height: '4rem' }}
                >
                  <MDBIcon icon="store" size="2x" className="text-white" />
                </div>
                <h4>Удобное расположение</h4>
                <p>Наши магазины расположены в удобных районах города с парковками</p>
              </div>
            </MDBCol>
          </MDBRow>
        </section>

        {/* Additional Info */}
        <section className="py-5">
          <div className="p-4 p-md-5 bg-light rounded-4 text-center">
            <h3>Посетите нас</h3>
            <p className="lead">
              Мы будем рады видеть вас в наших магазинах! Узнайте актуальные цены на нашем сайте 
              и приходите за покупками в удобное для вас время.
            </p>
            <Link to="/catalog" className="btn btn-primary btn-lg mt-3">
              <MDBIcon icon="list" className="me-2" />
              Перейти в каталог
            </Link>
          </div>
        </section>
      </MDBContainer>
    </div>
  );
};

export default AboutPage;
