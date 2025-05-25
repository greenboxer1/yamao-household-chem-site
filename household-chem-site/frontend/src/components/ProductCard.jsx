import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage } from 'mdb-react-ui-kit';

function ProductCard({ product }) {
  return (
    <MDBCard className="mb-4 shadow-sm h-100 d-flex flex-column">
      <div style={{ height: '200px', overflow: 'hidden' }}>
        <MDBCardImage 
          src={product.image} 
          position="top" 
          alt={product.name} 
          className="img-fluid w-100 h-100"
          style={{ objectFit: 'cover' }}
        />
      </div>
      <MDBCardBody className="d-flex flex-column" style={{ flex: '1 0 auto' }}>
        <MDBCardTitle className="fw-bold mb-2" style={{ fontSize: '1rem' }}>{product.name}</MDBCardTitle>
        <div className="price mt-auto">
          {product.discountPrice ? (
            <div className="d-flex align-items-baseline gap-2">
              <span className="text-decoration-line-through text-muted">{product.price.toFixed(2)} ₽</span>
              <span className="fw-bold text-danger">{product.discountPrice.toFixed(2)} ₽</span>
            </div>
          ) : (
            <span className="fw-bold">{product.price.toFixed(2)} ₽</span>
          )}
        </div>
        {product.weight && <MDBCardText className="mb-0 mt-2 text-muted">{product.weight}</MDBCardText>}
      </MDBCardBody>
    </MDBCard>
  );
}

export default ProductCard;