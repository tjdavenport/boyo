import './index.scss';
import ReactDOM from 'react-dom';
import Nav from './components/Nav'; 
import React, {useState} from 'react';
import Button from 'muicss/lib/react/button';
import BarLoader from 'react-spinners/BarLoader';
import PopupPoller from './components/PopupPoller';
import {useProfile, useServers, useGuildRoles} from './hooks';
import {BrowserRouter, Switch, Route, Link} from 'react-router-dom';

const addBotUrl = guildId => 
  `https://discord.com/api/oauth2/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&scope=bot&permissions=1006758976&guild_id=${guildId}`;

const GuildButton = ({guildId}) => {
  const {guildRoles, loadingGuildRoles} = useGuildRoles(guildId);
  const [pending, setPending] = useState(0);

  return (
    <React.Fragment>
      <PopupPoller 
        lsKey="added-server" 
        title={`Add boyo.gg`}
        width="400" 
        height="800"
        location={addBotUrl(guildId)}
        active={pending}
        onTimeout={() => setPending(false)}
        onDone={() => alert('we are authenticated')}
      />
      <div>
        <Button className="m-0" disabled={loadingGuildRoles || pending} size="small" color="accent" variant="raised" onClick={e => {
          setPending(guildId);
        }}>
          {loadingGuildRoles ? (
            <>...</>
          ) : (
            (guildRoles.length > 0) ? <React.Fragment> Manage Bots </React.Fragment> : <React.Fragment>Setup boyo.gg</React.Fragment>
          )}
        </Button>
        {(loadingGuildRoles || !!pending) && (
          <BarLoader color="#AE81FF" width="100%"/>
        )}
      </div>
    </React.Fragment>

  );
};

const Servers = ({servers, loadingServers}) => {
  return (
    <div className="d-flex justify-content-center flex-column">
      <h3 className="text-center mb-5">Select a Server</h3>
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
              <GuildButton guildId={server.id}/>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


function Index() {
  const {profile, loading: loadingProfile} = useProfile();
  const {servers, loading: loadingServers} = useServers();

  return (
    <React.StrictMode>
      <BrowserRouter basename="/dashboard">
        <Nav profile={profile} loadingProfile={loadingProfile}/>
        <Switch>
          <Route path="/server/:serverId">foo bar foo</Route>
          <Route path="/"><Servers servers={servers} loadingServers={loadingServers}/></Route>
        </Switch>
      </BrowserRouter>
    </React.StrictMode>
  );
};

ReactDOM.render(<Index/>, document.getElementById('root'));
