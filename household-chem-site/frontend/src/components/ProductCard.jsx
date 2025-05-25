import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage } from 'mdb-react-ui-kit';

function ProductCard({ product }) {
  return (
    <MDBCard className="h-100 d-flex flex-column shadow-sm" style={{ transition: 'all 0.2s ease' }}>
      <div style={{ height: '160px', overflow: 'hidden' }}>
        <MDBCardImage 
          src={product.image} 
          position="top" 
          alt={product.name} 
          className="img-fluid w-100 h-100"
          style={{ 
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
      </div>
      <MDBCardBody className="d-flex flex-column p-3" style={{ flex: '1 0 auto' }}>
        <MDBCardTitle 
          className="fw-semibold mb-2" 
          style={{ 
            fontSize: '0.95rem', 
            lineHeight: '1.3',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '3.9rem', // 3 lines * 1.3 line-height
            maxHeight: '3.9rem',
            wordBreak: 'break-word',
            hyphens: 'auto'
          }}
          title={product.name}
        >
          {product.name}
        </MDBCardTitle>
        <div className="price mt-auto">
          {product.discountPrice ? (
            <div className="d-flex align-items-baseline gap-2">
              <span className="text-decoration-line-through text-muted small">{product.price.toFixed(2)} ₽</span>
              <span className="fw-bold text-danger" style={{ fontSize: '1.05rem' }}>{product.discountPrice.toFixed(2)} ₽</span>
            </div>
          ) : (
            <span className="fw-bold" style={{ fontSize: '1.05rem' }}>{product.price.toFixed(2)} ₽</span>
          )}
        </div>
        {product.weight && (
          <MDBCardText className="small text-muted mb-0 mt-1">
            {product.weight}
          </MDBCardText>
        )}
      </MDBCardBody>
    </MDBCard>
  );
}

export default ProductCard;