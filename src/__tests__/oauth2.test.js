/**
 * @jest-environment node
 */
const axios = require('axios');
const tough = require('tough-cookie');
const boyo = require('../__mocks__/boyo');
const axiosCookieJarSupport = require('axios-cookiejar-support').default;

axiosCookieJarSupport(axios);
const client = axios.create({
  baseURL: 'http://localhost:1337',
  withCredentials: true,
});
client.defaults.jar = new tough.CookieJar();

describe('endopints involving oAuth2', () => {
  it('creates a user and authenticates with Discord', done => {
    boyo.on('log', msg => {
      (msg === 'user authenticated') && done();
    });
    client.get('/login');
  });
});
