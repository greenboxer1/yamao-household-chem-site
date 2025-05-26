import React from 'react';
import { MDBContainer, MDBTypography, MDBBtn } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <MDBContainer className="text-center py-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
      <MDBTypography tag="h1" variant="display-1" className="fw-bold mb-3" style={{ fontSize: '10rem', color: '#6c757d' }}>404</MDBTypography>
      <MDBTypography tag="h4" className="mb-3 text-uppercase fw-bold">Страница не найдена</MDBTypography>
      <MDBTypography className="mb-4 text-muted" style={{ maxWidth: '600px' }}>
        К сожалению, мы не можем найти страницу, которую вы ищете.
        Возможно, она была перемещена, удалена или вы просто ошиблись в адресе.
      </MDBTypography>
      <MDBBtn tag={Link} to="/" color="primary" size="lg" className="px-5">
        На главную
      </MDBBtn>
    </MDBContainer>
  );
};

export default NotFoundPage;
