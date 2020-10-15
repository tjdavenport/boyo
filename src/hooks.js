import axios from 'axios';
import React, {useEffect, useState} from 'react';

export const useProfile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/users/@me').then(({data}) => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  return {profile, loading};
};

export const useGuildRoles = guildId => {
  const [guildRoles, setGuildRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/guilds/${guildId}/roles`).then(({data}) => {
      setGuildRoles(data);
      setLoading(false);
    });
  }, []);

  return {guildRoles, loading};
};

export const useServers = () => {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/users/@me/guilds').then(({data}) => {
      setServers(data);
      setLoading(false);
    });
  }, []);

  return {servers, loading};
};
