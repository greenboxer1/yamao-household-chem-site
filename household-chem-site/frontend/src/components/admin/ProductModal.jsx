import { useState, useEffect } from 'react';
import { MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter, MDBBtn, MDBInput, MDBRow, MDBCol, MDBFile } from 'mdb-react-ui-kit';

const ProductModal = ({ show, onClose, onSave, product, categories }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discountPrice: '',
    weight: '',
    CategoryId: categories[0]?.id || '',
    imageFile: null
  });
  const [preview, setPreview] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice || '',
        weight: product.weight,
        CategoryId: product.CategoryId,
        imageFile: null
      });
      setPreview(product.image || '');
    } else {
      setFormData({
        name: '',
        price: '',
        discountPrice: '',
        weight: '',
        CategoryId: categories[0]?.id || '',
        imageFile: null
      });
      setPreview('');
    }
    setErrors({});
  }, [product, categories]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'imageFile' && files && files[0]) {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (formData.discountPrice && (isNaN(formData.discountPrice) || formData.discountPrice <= 0)) {
      newErrors.discountPrice = 'Valid discount price is required';
    }
    if (!formData.weight) newErrors.weight = 'Weight is required';
    if (!formData.CategoryId) newErrors.CategoryId = 'Category is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        CategoryId: parseInt(formData.CategoryId)
      });
    }
  };

  return (
    <MDBModal show={show} setShow={onClose} tabIndex='-1' staticBackdrop>
      <MDBModalHeader>
        <h5>{product ? 'Edit Product' : 'Add New Product'}</h5>
      </MDBModalHeader>
      <form onSubmit={handleSubmit}>
        <MDBModalBody>
          <MDBRow>
            <MDBCol md="6">
              <div className="mb-3">
                <MDBInput
                  label="Product Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? 'is-invalid' : ''}
                />
                {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
              </div>
              
              <div className="mb-3">
                <MDBInput
                  type="number"
                  label="Price ($)"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={errors.price ? 'is-invalid' : ''}
                />
                {errors.price && <div className="invalid-feedback d-block">{errors.price}</div>}
              </div>
              
              <div className="mb-3">
                <MDBInput
                  type="number"
                  label="Discount Price ($) - Optional"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={errors.discountPrice ? 'is-invalid' : ''}
                />
                {errors.discountPrice && <div className="invalid-feedback d-block">{errors.discountPrice}</div>}
              </div>
              
              <div className="mb-3">
                <MDBInput
                  label="Weight (e.g., 500ml, 1kg)"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className={errors.weight ? 'is-invalid' : ''}
                />
                {errors.weight && <div className="invalid-feedback d-block">{errors.weight}</div>}
              </div>
              
              <div className="mb-3">
                <select 
                  className={`form-select ${errors.CategoryId ? 'is-invalid' : ''}`}
                  name="CategoryId"
                  value={formData.CategoryId}
                  onChange={handleChange}
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.CategoryId && <div className="invalid-feedback d-block">{errors.CategoryId}</div>}
              </div>
            </MDBCol>
            
            <MDBCol md="6" className="d-flex flex-column align-items-center">
              <div className="mb-3 text-center">
                {preview ? (
                  <img 
                    src={preview} 
                    alt="Preview" 
                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }}
                    className="img-thumbnail"
                  />
                ) : (
                  <div className="border rounded d-flex align-items-center justify-content-center" 
                       style={{ width: '200px', height: '200px', backgroundColor: '#f8f9fa' }}>
                    No image
                  </div>
                )}
              </div>
              
              <div className="w-100">
                <MDBFile 
                  label="Product Image" 
                  id="imageFile" 
                  name="imageFile"
                  onChange={handleChange}
                  className={errors.imageFile ? 'is-invalid' : ''}
                />
                <div className="form-text">Leave empty to keep current image</div>
                {errors.imageFile && <div className="invalid-feedback d-block">{errors.imageFile}</div>}
              </div>
            </MDBCol>
          </MDBRow>
        </MDBModalBody>
        
        <MDBModalFooter>
          <MDBBtn type="button" color="secondary" onClick={onClose}>
            Cancel
          </MDBBtn>
          <MDBBtn type="submit" color="primary">
            {product ? 'Update' : 'Create'}
          </MDBBtn>
        </MDBModalFooter>
      </form>
    </MDBModal>
  );
};

export default ProductModal;
