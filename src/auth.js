import axios from 'axios';
import useAxios, {makeUseAxios} from 'axios-hooks';

export const user = {};

const discordios = axios.create({
  baseURL: 'https://discord.com/api',
});

discordios.interceptors.request.use(config => {
  config.headers = {
    ...(config.headers ? config.headers : {}),
    Authorization: `Bearer ${user.accessToken}`
  }
  return config;
});

export const useDiscordios = makeUseAxios({
  axios: discordios
});
