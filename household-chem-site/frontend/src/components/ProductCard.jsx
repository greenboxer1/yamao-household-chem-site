import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage } from 'mdb-react-ui-kit';

function ProductCard({ product }) {
  return (
    <MDBCard className="mb-4 shadow-sm">
      <MDBCardImage src={product.image} position="top" alt={product.name} className="img-fluid" />
      <MDBCardBody>
        <MDBCardTitle className="fw-bold">{product.name}</MDBCardTitle>
        <div className="price">
          {product.discountPrice ? (
            <>
              <span className="original-price">{product.price.toFixed(2)} ₽</span>
              <span className="discount-price">{product.discountPrice.toFixed(2)} ₽</span>
            </>
          ) : (
            <span>{product.price.toFixed(2)} ₽</span>
          )}
        </div>
        <MDBCardText>{product.weight}</MDBCardText>
      </MDBCardBody>
    </MDBCard>
  );
}

export default ProductCard;