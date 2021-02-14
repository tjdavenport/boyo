import './index.scss';
import ReactDOM from 'react-dom';
import Nav from './components/Nav'; 
import useAxios from 'axios-hooks';
import React, {useState} from 'react';
import Popup from './components/Popup';
import Button from 'muicss/lib/react/button';
import BarLoader from 'react-spinners/BarLoader';
import {BrowserRouter, Switch, Route, useParams, useHistory} from 'react-router-dom';

const addBotUrl = guildId => 
  `https://discord.com/api/oauth2/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&scope=bot&permissions=1006758976&guild_id=${guildId}`;

const Servers = () => {
  const [{data: servers = [], loading: loadingServers}] = useAxios('/api/users/@me/guilds');
  const history = useHistory();

  return (
    <div className="d-flex justify-content-center flex-column">
      <h3 className="text-center mb-5">My Servers</h3>
      <div style={{display: 'inline-block', margin: '0 auto'}}>
        {loadingServers ? (
          <>foobar</>
        ) : (
          servers.filter(({permissions}) => ((permissions & 8) !== 0) || ((permissions & 32) !== 0)).map(server => (
            <div className="d-flex align-items-center mb-3" key={server.id}>
              {server.icon ? (
                <img width="45" height="45" className="mr-3" style={{borderRadius: '999px'}} src={`https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`}/>
              ) : (
                <div className="d-flex align-items-center justify-content-center mr-3" style={{width: '45px', height: '45px', borderRadius: '999px', border: '1px #fff solid'}}>
                  <strong>{server.name[0].toUpperCase()}</strong>
                </div>
              )}
              <p className="lead m-0 mr-5 flex-grow-1">{server.name}</p>
              <Button className="m-0" size="small" color="accent" variant="raised" onClick={e => history.push(`/server/${server.id}`)}>
                Manage Bots
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const Server = () => {
  const {serverId} = useParams();
  const [{data: servers = [], loading: loadingServers}] = useAxios(`/api/guilds/${serverId}`);

  return (
    <>derp</>
  );
};


function Index() {
  const [{data: profile, loading: loadingProfile}] = useAxios('/api/users/@me');

  return (
    <React.StrictMode>
      <BrowserRouter basename="/dashboard">
        <Nav profile={profile} loadingProfile={loadingProfile}/>
        <Switch>
          <Route path="/server/:serverId"><Server/></Route>
          <Route path="/"><Servers/></Route>
        </Switch>
      </BrowserRouter>
    </React.StrictMode>
  );
};

ReactDOM.render(<Index/>, document.getElementById('root'));
