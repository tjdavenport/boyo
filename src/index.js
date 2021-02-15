import './index.scss';
import axios from 'axios';
import ReactDOM from 'react-dom';
import Nav from './components/Nav'; 
import Popup from './components/Popup';
import {user, useDiscordios} from './auth';
import {categories} from './lib/constants';
import Button from 'muicss/lib/react/button';
import React, {useState, useEffect} from 'react';
import BarLoader from 'react-spinners/BarLoader';
import useAxios, {makeUseAxios} from 'axios-hooks';
import PacmanLoader from 'react-spinners/PacmanLoader';
import {faPlug} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {BrowserRouter, Link, Switch, Route, useParams, useHistory} from 'react-router-dom';


const addBotUrl = guildId => 
  `https://discord.com/api/oauth2/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&scope=bot&permissions=1006758976&guild_id=${guildId}`;

const Servers = () => {
  const [{data: servers = [], loading: loadingServers}] = useDiscordios('/users/@me/guilds');
  const history = useHistory();

  return (
    <div className="d-flex justify-content-center flex-column mt-4">
      <h3 className="text-center mb-5">My Servers</h3>
      <div style={{display: 'inline-block', margin: '0 auto'}}>
        {loadingServers ? (
          <PacmanLoader color="#AE81FF" />
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
              <Button className="m-0" size="small" color="accent" variant="raised" onClick={e => history.push(`/server/${server.id}/${encodeURI(server.name)}`)}>
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
  const {serverId, uriServerName} = useParams();
  const [{data: server = {}, loading: loadingServer}] = useDiscordios(`/guilds/${serverId}`);

  return (
    <React.Fragment>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/dashboard">My Servers</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{decodeURI(uriServerName)}</li>
        </ol>
      </nav>
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <h2>Available Commands</h2>
            <div className="row">
              {Object.keys(categories['nitrado-dayz'].botCommands).map(key => {
                const botCommand = categories['nitrado-dayz'].botCommands[key];
                return (
                  <div key={key} className="col-sm-12 col-md-4 col-lg-3 mb-4">
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
        </div>
      </div>
    </React.Fragment>
  );
};

const App = () => {
  const [{data: authedUser, loading: loadingUser}] = useAxios('/api/user');
  const [{data: profile = {}, loading: loadingProfile}, getProfile] = useDiscordios({
    url: '/users/@me'
  }, {manual: true});

  useEffect(() => {
    if (authedUser) {
      Object.assign(user, authedUser);
      getProfile();
    }
  }, [authedUser])
  
  return (
    <React.Fragment>
      <Nav profile={profile} loadingProfile={loadingProfile}/>
      {loadingUser ? (
        <div><PacmanLoader/></div>
      ) : <Dashboard/>}
    </React.Fragment>
  );
}

const Dashboard = ({user}) => {
  return (
    <React.StrictMode>
      <BrowserRouter basename="/dashboard">
        <Switch>
          <Route path="/server/:serverId/:uriServerName"><Server/></Route>
          <Route path="/"><Servers/></Route>
        </Switch>
      </BrowserRouter>
    </React.StrictMode>
  );
};


function Index() {
  return <App/>;
};

ReactDOM.render(<Index/>, document.getElementById('root'));
