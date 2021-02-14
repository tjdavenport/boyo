import React from 'react';
import Logo from './Logo';

export default function Nav({profile = {}, loading}) {
  return (
    <div className="color-bg mui--z1 p-3 d-flex align-items-center mb-4">
      <Logo/>
      <nav className="ml-5 flex-grow-1">
        <a className="color-fg mr-3 " href="#">Servers</a>
        <a className="color-fg text-clear" href="#">Support</a>
      </nav>
      <nav className="ml-5 d-flex align-items-center">
        {(profile.id && profile.avatar) && (
          <img className="mr-3" style={{width: '40px', height: '40px', borderRadius: '999px'}} src={`https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`}/>
        )}
        <a className="color-fg mr-3 text-clear" href="#">{profile.username || '...'}</a>
      </nav>
    </div>
  );
}
