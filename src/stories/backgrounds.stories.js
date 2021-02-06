import React from 'react';

export default {
  title: 'Backgrounds',
};

export const trianglify = () => {
  return (
    <div className="trianglify">
      <div className="trianglify__overlay"/>
      <div className="trianglify__content">
        <h1>Trianglify</h1>
      </div>
    </div>
  );
};

export const card = () => {
  return (
    <div className="color-bg-darker p-3 mui--z3 key-streak" style={{minWidth: '40%', maxWidth: '400px'}}>
      <h1>Card</h1>
    </div>
  );
};
