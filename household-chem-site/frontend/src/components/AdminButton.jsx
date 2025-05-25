import { MDBBtn } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

const AdminButton = () => {
  const navigate = useNavigate();
  
  const handleAdminClick = () => {
    if (localStorage.getItem('token')) {
      navigate('/admin');
    } else {
      navigate('/admin/login');
    }
  };

  return (
    <div className="position-fixed" style={{ bottom: '20px', right: '20px', zIndex: 1000 }}>
      <MDBBtn 
        color="dark" 
        floating 
        size="lg" 
        onClick={handleAdminClick}
        title="Admin Panel"
      >
        <i className="fas fa-user-shield"></i>
      </MDBBtn>
    </div>
  );
};

export default AdminButton;
