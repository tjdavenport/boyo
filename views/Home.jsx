import '../src/index.scss';
import {css} from '@emotion/core';
import React, {useState} from 'react';
import Logo from'../src/components/Logo';
import Button from 'muicss/lib/react/button';
import BarLoader from 'react-spinners/BarLoader';
import PopupPoller from '../src/components/PopupPoller';
import {faCog} from '@fortawesome/free-solid-svg-icons';
import {faDiscord} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

export default function Home({isAuthenticated}) {
  const [pending, setPending] = useState(false);

  return (
    <>
      <div className="trianglify" style={{height: '70vh'}}>
        <div className="trianglify__overlay"/>
        <div className="trianglify__content p-3 d-flex align-items-center justify-content-center">
          <div>
            <div className="mui--text-display3 mb-1">Boutique Discord Bots</div>
            <p className="mui--text-subhead ml-1 mb-2">Run the server we all want to be in</p>
            <div className="d-flex">
              <div className="pl-1">
                {isAuthenticated ? (
                  <Button className="m-0" disabled={pending} color="accent" variant="raised" onClick={e => alert('poop')}>
                    <FontAwesomeIcon size="lg" className="mr-1" icon={faCog}/> My Dashboard
                  </Button>
                ) : (
                  <React.Fragment>
                    <PopupPoller 
                      title="Authorize boyo.gg" 
                      width="400" 
                      height="800"
                      location="/login"
                      active={pending}
                      onTimeout={() => setPending(false)}
                      onDone={() => alert('we are authenticated')}
                    />
                    <Button className="m-0" disabled={pending} color="accent" variant="raised" onClick={e => setPending(true)}>
                      <FontAwesomeIcon style={{verticalAlign: 'middle'}} size="lg" className="mr-1" icon={faDiscord}/> Add to Discord
                    </Button>
                    {pending && (
                      <BarLoader color="#AE81FF" width="100%"/>
                    )}
                  </React.Fragment>
                )}
              </div>
              <Button className="m-0 ml-1" color="primary" variant="flat" size="lg">Learn More</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center my-4">
        <Logo/>
      </div>
      <div className="d-flex justify-content-center pb-5">
        <div className="color-bg px-3 mui--z2 key-streak" style={{minWidth: '40%', maxWidth: '800px'}}>
          <h1>Entering Open Alpha</h1>
          <p>A suite of tools built for game server admins and PC gaming enthusiasts. Boyo.gg tries to provide tools community leaders can use to create the best possible experience for themselves and their members.</p>
          <p>Starting with a focus on console DayZ, boyo.gg will provide;</p>
          <ul>
            <li>Configurable server maintenance commands for restarts, bans and unbans.</li>
            <li>Automated anti-grief protection for easy enforcement of raiding rules.</li>
            <li>Server logs pumped into discord with iZurvive links for efficient monitoring.</li>
            <li>Activity feed for PvP and building events.</li>
            <li>Management of server xml configuration via Discord file uploads.</li>
            <li>King of the Hill: a new dimension of DayZ PvP based land control.</li>
            <li>...and much more</li>
          </ul>
          <p><a href="">Join the pilot server</a></p>
        </div>
      </div>
    </>
  );
}
