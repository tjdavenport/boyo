import React from 'react';
import Button from 'muicss/lib/react/button';

export default {
  title: 'Containers',
};

export const trianglify = () => {
  return (
    <>
      <div className="trianglify mui--z3" style={{width: '350px', height: '200px'}}>
        <div className="trianglify__overlay"/>
        <div className="trianglify__content px-3 pt-2">
          <div className="mui--text-title mb-2">Server Maintenance</div>
          <p className="mb-3">Adds commands for stopping, starting and restarting your DayZ Nitrado server.</p>
          <Button className="m-0" color="accent" size="small" variant="raised">
            Enable
          </Button>
        </div>
      </div>
    </>
  );
};

export const card = () => {
  return (
    <div className="color-bg-darker p-3 mui--z3 key-streak" style={{minWidth: '40%', maxWidth: '400px'}}>
      <h1>Card</h1>
    </div>
  );
};
