import React from 'react';

const TestPage = () => {
  console.log('TestPage is rendering!');
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#f0f0f0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1>Test Page</h1>
        <p>If you can see this, routing is working!</p>
        <div style={{ marginTop: '20px', color: 'blue' }}>
          This is a test component to verify rendering
        </div>
      </div>
    </div>
  );
};

export default TestPage;
