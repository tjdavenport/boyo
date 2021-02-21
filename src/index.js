import './index.scss';
import axios from 'axios';
import ReactDOM from 'react-dom';
import Nav from './components/Nav'; 
import Popup from './components/Popup';
import {user, useDiscordios} from './auth';
import {categories} from './lib/constants';
import Button from 'muicss/lib/react/button';
import Select from 'muicss/lib/react/select';
import Option from 'muicss/lib/react/option';
import BarLoader from 'react-spinners/BarLoader';
import useAxios, {makeUseAxios} from 'axios-hooks';
import PacmanLoader from 'react-spinners/PacmanLoader';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import React, {useState, useEffect, useMemo, useRef} from 'react';
import {faPlug, faMinusCircle} from '@fortawesome/free-solid-svg-icons';
import {BrowserRouter, Link, Switch, Route, useParams, useHistory} from 'react-router-dom';


const addBotUrl = (guildId, perms) => 
  `https://discord.com/api/oauth2/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&scope=bot&permissions=${perms}&guild_id=${guildId}`;

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

const botCommandModals = {
  'nitrado-dayz-restart': function Modal({command, botCommand, serverId, roles, config = {}}) {
    const [roleIds, setRoleIds] = useState(config.roleIds || []);
    const [{data: nitradoData, loading}] = useAxios(`/guilds/${serverId}/nitrado/services`);
    const selectRole = useRef();

    useEffect(() => {
      if (selectRole.current) {
        selectRole.current.value = '';
      }
    }, [roleIds]);

    return (
      <div className="backdrop pt-5 pb-1">
        <div className="color-bg p-4 mui--z3 xs-90-width" style={{width: '400px', margin: '0 auto'}}>
          <kbd className="mui--text-title">!{command}</kbd>
          {loading ? <div className="py-3"><PacmanLoader color="#AE81FF" /></div> : (
            <React.Fragment>
              <div className="pt-3">
                <Select name="serviceId" required defaultValue="" id="select-service">
                  <Option value="" label="Select DayZ Server"/>
                  {nitradoData.data.services.filter(({details}) => details.game.includes('DayZ')).map(service => (
                    <Option value={service.id} label={service.details.name} key={service.id}/>
                  ))}
                </Select>
              </div>
              <div className="pt-3">
                <p className="mui--text-caption mb-1">Only members with these roles can use the command.</p>
                <Select name="roles" ref={selectRole} defaultValue="" id="select-roles" onChange={e => (e.target.value !== '') && setRoleIds([...roleIds, e.target.value])}>
                  <Option value="" label="Select authorized roles"/>
                  {roles.filter(({managed, id}) => (!managed && !roleIds.includes(id))).map(role => (
                    <Option value={role.id} label={role.name} key={role.id}/>
                  ))}
                </Select>
                {roleIds.map(roleId => (
                  <Button className="mb-2" size="small" variant="flat" onClick={() => setRoleIds(roleIds.filter(selectedRoleId => selectedRoleId !== roleId))}>
                    <span className="mr-2"><FontAwesomeIcon icon={faMinusCircle}/></span>
                    {roles.find(({id}) => id === roleId).name}
                  </Button>
                ))}
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
};

const BotCommand = ({botCommand, command, loading, hasPerms, hasLinks, hasAttached, getRoles, getLinks, serverId, roles}) => {
  const [pendingPerms, setPendingPerms] = useState(false);
  const [pendingLinks, setPendingLinks] = useState(false);
  const [configModal, setConfigModal] = useState(false);
  const [linksModal, setLinksModal] = useState(false);
  const ConfigModal = useMemo(() => botCommandModals[command], [command]);

  useEffect(() => {
    console.log('executing hook');
    if (hasPerms && pendingPerms && !hasLinks) {
      setLinksModal(true);
      setPendingPerms(false);
    }
    if (hasLinks && linksModal && pendingLinks) {
      setConfigModal(true);
      setLinksModal(false);
      setPendingLinks(false);
    }
  }, [hasLinks, hasPerms]);

  return (
    <div className="col-sm-12 col-md-4 col-lg-3 mb-4">
      <div className="trianglify mui--z3" style={{width: '100%', height: '175px'}}>
        <div className="trianglify__overlay"/>
        <div className="trianglify__content px-3 pt-2">
          <div className="mui--text-title mb-2"><kbd>!{command}</kbd></div>
          <p className="mb-3">{botCommand.description}</p>
          {loading && (
            <div style={{display: 'inline-block'}}>
              <Button className="m-0" size="small" disabled color="accent" variant="raised">
                loading
              </Button>
              <div style={{marginTop: '-4px'}}>
                <BarLoader color="#AE81FF" width="100%"/>
              </div>
            </div>
          )}
          {!loading && (
            <React.Fragment>
              {configModal && <ConfigModal command={command} botCommand={botCommand} serverId={serverId} roles={roles}/>}
              {linksModal && (
                <div className="backdrop pt-5 pb-1">
                  <div className="color-bg p-4 mui--z3 xs-90-width" style={{width: '400px', margin: '0 auto'}}>
                    <kbd className="mui--text-title">!{command}</kbd>
                    <div className="pt-3">
                      {botCommand.oAuth2Links.map(link => (
                        <div key={link}>
                          <p className="mb-4">This command requires a linked {link} account.</p>
                          <div className="d-flex align-items-center justify-content-end">
                            <Button size="small" variant="flat" onClick={() => {
                              setLinksModal(false);
                              setPendingLinks(false);
                            }}>
                              Cancel
                            </Button>
                            <div>
                              <Button className="m-0 ml-2" size="small" disabled={pendingLinks} variant="raised" onClick={() => setPendingLinks(link)}>
                                Link {link} account
                              </Button>
                              {pendingLinks && (
                                <div style={{marginTop: '-4px'}}>
                                  <BarLoader color="#272822" width="100%"/>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {pendingPerms && (
                <Popup
                  title={`Enable ${command}`}
                  width="400" 
                  height="800"
                  location={addBotUrl(serverId, botCommand.discordPerms.reduce((a, b) => a | b, 0))}
                  onClose={() => getRoles().catch(err => setPendingPerms(false))}
                />
              )}
              {pendingLinks && (
                <Popup
                  title={`Link ${pendingLinks} account`}
                  width="400" 
                  height="800"
                  location={`/guilds/${serverId}/add-service/${pendingLinks}`}
                  onClose={() => getLinks().then(({data: links}) => links.map(({type}) => type).includes(pendingLinks) && setPendingLinks(false))}
                />
              )}
              <div style={{display: 'inline-block'}}>
                <Button className="m-0" size="small" color="accent" disabled={pendingPerms || pendingLinks} variant="raised" onClick={() => {
                  if (!hasPerms) {
                    return setPendingPerms(true);
                  }
                  if (!hasLinks) {
                    return setLinksModal(true);
                  }
                  if (!hasAttached) {
                    return setConfigModal(true);
                  }
                }}>
                  <span className="mr-1"><FontAwesomeIcon icon={faPlug}/></span> Enable
                </Button>
                {(pendingPerms || pendingLinks) && (
                  <div style={{marginTop: '-4px'}}>
                    <BarLoader color="#AE81FF" width="100%"/>
                  </div>
                )}
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

const Server = () => {
  const {serverId, uriServerName} = useParams();
  const [{data: roles = [], loading: loadingRoles}, getRoles] = useAxios(`/api/guilds/${serverId}/roles`);
  const [{data: oAuth2Links = [], loading: loadingOAuth2Links}, getLinks] = useAxios(`/api/guilds/${serverId}/oauth2-links`);
  const [{data: attachedBotCommands = [], loading: loadingAttachedBotCommands}, getAttachedBotCommands] = useAxios(`/api/guilds/${serverId}/attached-bot-commands`);

  const boyoRole = roles.find(({tags}) => tags && tags['bot_id'] === '752638531972890726') || {};

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
                  <BotCommand 
                    key={key} 
                    command={key}
                    roles={roles}
                    serverId={serverId} 
                    getRoles={getRoles} 
                    getLinks={getLinks}
                    botCommand={categories['nitrado-dayz'].botCommands[key]} 
                    hasPerms={botCommand.discordPerms.every(perm => (boyoRole.permissions & perm) == perm)}
                    hasLinks={botCommand.oAuth2Links.every(link => oAuth2Links.find(({type}) => type === link))}
                    hasAttached={attachedBotCommands.map(({key: attachedKey}) => attachedKey).includes(key)}
                    loading={loadingRoles || loadingOAuth2Links || loadingAttachedBotCommands}/>
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
