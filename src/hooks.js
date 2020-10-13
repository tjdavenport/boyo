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
