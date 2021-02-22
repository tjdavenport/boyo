const axios = require('axios');
const tough = require('tough-cookie');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;

module.exports = () => {
  axiosCookieJarSupport(axios);
  const client = axios.create({
    baseURL: 'http://localhost:1337',
    withCredentials: true,
  });
  client.defaults.jar = new tough.CookieJar();
  client.interceptors.response.use(response => response, error => {
    console.log(error.response.data);
    return Promise.reject(error);
  });
  return client;
};
