import React from 'react';

const TestComponent = () => {
  console.log('TestComponent is rendering!');
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: 'red',
      color: 'white',
      padding: '10px',
      zIndex: 9999
    }}>
      Test Component is visible!
    </div>
  );
};

export default TestComponent;
