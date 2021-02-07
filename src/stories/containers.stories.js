import React from 'react';
import Button from 'muicss/lib/react/button';
import {faExclamationCircle} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export default {
  title: 'Containers',
};

export const trianglify = () => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-4 mb-4">
            <div className="trianglify mui--z3" style={{width: '100%', height: '200px'}}>
              <div className="trianglify__overlay"/>
              <div className="trianglify__content px-3 pt-2">
                <div className="mui--text-title mb-2">Server Maintenance</div>
                <p className="mb-3">Adds commands for stopping, starting and restarting your DayZ Nitrado server.</p>
                <Button className="m-0" size="small" variant="raised">
                  <FontAwesomeIcon icon={faExclamationCircle}/> Requires Nitrado Link
                </Button>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-4 mb-4">
            <div className="trianglify mui--z3" style={{width: '100%', height: '200px'}}>
              <div className="trianglify__overlay"/>
              <div className="trianglify__content px-3 pt-2">
                <div className="mui--text-title mb-2">Server Maintenance</div>
                <p className="mb-3">Adds commands for stopping, starting and restarting your DayZ Nitrado server.</p>
                <Button className="m-0" color="accent" size="small" variant="raised">
                  Enable
                </Button>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-lg-4 mb-4">
            <div className="trianglify mui--z3" style={{width: '100%', height: '200px'}}>
              <div className="trianglify__overlay"/>
              <div className="trianglify__content px-3 pt-2">
                <div className="mui--text-title mb-2">Server Maintenance</div>
                <p className="mb-3">Adds commands for stopping, starting and restarting your DayZ Nitrado server.</p>
                <Button className="m-0" color="accent" size="small" variant="raised">
                  Enable
                </Button>
              </div>
            </div>
          </div>
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
