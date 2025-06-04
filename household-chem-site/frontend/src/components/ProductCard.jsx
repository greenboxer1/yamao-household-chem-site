import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage } from 'mdb-react-ui-kit';
import styles from './ProductCard.module.css';

function ProductCard({ product }) {
  return (
    <MDBCard className={`h-100 d-flex flex-column shadow-sm ${styles.productCard}`}>
      <div className={styles.productCardImageContainer}>
        <MDBCardImage 
          src={product.image} 
          position="top" 
          alt={product.name} 
          className={`${styles.productCardImage}`}
        />
      </div>
      <MDBCardBody className={styles.productCardBody}>
        <MDBCardTitle 
          className={styles.productCardTitle}
          title={product.name}
        >
          {product.name}
        </MDBCardTitle>
        <div className={styles.productPrice}>
          {product.discountPrice ? (
            <>
              <span className={styles.originalPrice}>{product.price.toFixed(2)} ₽</span>
              <span className={styles.discountPrice}>{product.discountPrice.toFixed(2)} ₽</span>
            </>
          ) : (
            <span>{product.price.toFixed(2)} ₽</span>
          )}
        </div>
        {product.weight && (
          <MDBCardText className={styles.productWeight}>
            {product.weight}
          </MDBCardText>
        )}
      </MDBCardBody>
    </MDBCard>
  );
}

export default ProductCard;