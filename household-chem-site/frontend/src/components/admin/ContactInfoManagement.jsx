import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBTypography } from 'mdb-react-ui-kit';
import axios from 'axios';

const ContactInfoManagement = () => {
  const [contactInfo, setContactInfo] = useState({
    phone: '',
    email: '',
    vkUrl: '',
    telegramUrl: '',
    whatsappUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false); // To manage typing state for success message

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/contact-info');
        setContactInfo(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching contact info:', err);
        setError('Не удалось загрузить контактную информацию. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    fetchContactInfo();
  }, []);

  // Autosave with debounce
  useEffect(() => {
    // Don't save on initial load or if not typing
    if (loading || !isTyping) {
      return;
    }

    const handler = setTimeout(async () => {
      setError(null);
      setIsTyping(false); // Reset typing state before saving
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Ошибка аутентификации. Пожалуйста, войдите снова.');
          return;
        }

        await axios.put('/api/admin/contact-info', contactInfo, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

      } catch (err) {
        console.error('Error autosaving contact info:', err);
        setError(err.response?.data?.error || 'Не удалось автоматически сохранить изменения.');
      }
    }, 1000); // Adjust debounce delay as needed (1000ms = 1 second)

    return () => {
      clearTimeout(handler);
    };
  }, [contactInfo, loading, isTyping]); // Rerun when contactInfo or loading state changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (!isTyping) setIsTyping(true); // Set typing to true when user starts typing
    setError(''); // Clear previous error message on new input
  };

  if (loading) {
    return <MDBTypography tag='p' className='text-center'>Загрузка...</MDBTypography>;
  }

  return (
    <MDBContainer className="mt-5">
      <MDBRow className="justify-content-center">
        <MDBCol md="8" lg="6">
          <MDBTypography variant='h4' className='text-center mb-4'>Управление контактной информацией</MDBTypography>
          
          {error && <MDBTypography color='danger' className='p-3 mb-3 border border-danger rounded text-center'>{error}</MDBTypography>}

          <form>
            <MDBInput 
              label='Телефон'
              name='phone'
              value={contactInfo.phone}
              onChange={handleChange}
              className='mb-4'
              required
            />
            <MDBInput 
              label='Email'
              name='email'
              type='email'
              value={contactInfo.email}
              onChange={handleChange}
              className='mb-4'
              required
            />
            <MDBInput 
              label='Ссылка ВКонтакте (URL)'
              name='vkUrl'
              value={contactInfo.vkUrl}
              onChange={handleChange}
              className='mb-4'
              type='url'
            />
            <MDBInput 
              label='Ссылка Telegram (URL)'
              name='telegramUrl'
              value={contactInfo.telegramUrl}
              onChange={handleChange}
              className='mb-4'
              type='url'
            />
            <MDBInput 
              label='Ссылка WhatsApp (URL)'
              name='whatsappUrl'
              value={contactInfo.whatsappUrl}
              onChange={handleChange}
              className='mb-4'
              type='url'
            />
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default ContactInfoManagement;
