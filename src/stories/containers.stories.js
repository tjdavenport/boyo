import React from 'react';
import {categories} from '../lib/constants';
import Button from 'muicss/lib/react/button';
import {faPlug} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export default {
  title: 'Containers',
};

export const trianglify = () => {
  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <h2>Available Commands</h2>
            <div className="row">
              {Object.keys(categories['nitrado-dayz'].botCommands).map(key => {
                const botCommand = categories['nitrado-dayz'].botCommands[key];
                return (
                  <div className="col-sm-12 col-md-6 mb-4">
                    <div className="trianglify mui--z3" style={{width: '100%', height: '175px'}}>
                      <div className="trianglify__overlay"/>
                      <div className="trianglify__content px-3 pt-2">
                        <div className="mui--text-title mb-2"><kbd>!{key}</kbd></div>
                        <p className="mb-3">{botCommand.description}</p>
                        <Button className="m-0" size="small" color="accent" variant="raised">
                          <span className="mr-1"><FontAwesomeIcon icon={faPlug}/></span> Enable
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-sm-12 col-md-6">
            <h2>Available Services</h2>
            <div className="row">
              <div className="col-sm-12 col-md-6 mb-4">
                <div className="trianglify mui--z3" style={{width: '100%', height: '175px'}}>
                  <div className="trianglify__overlay"/>
                  <div className="trianglify__content px-3 pt-2">
                    <div className="mui--text-title mb-2">Coming Soon</div>
                    <p className="mb-3">Services such as anti-grief, server logs, and custom game types coming soon.</p>
                  </div>
                </div>
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
