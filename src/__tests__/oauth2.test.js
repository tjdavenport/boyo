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

const guildId = '695309211608940674';

describe('endopints involving oAuth2', () => {
  it('creates a user and authenticates with Discord', async () => {
    await client.get('/login');
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        client.get('/api/is-authenticated').then(({data}) => {
          expect(data).toBe(true);
          resolve();
        }).catch(err => reject(err));
      }, 100);
    });
  });

  it('allows a user to create a connection with Nitrado', async () => {
    await client.get(`/guilds/${guildId}/add-service/nitrado`);

    await new Promise((resolve, reject) => {
      setTimeout(() => {
        client.get(`/api/guilds/${guildId}/oauth2-links`).then(({data}) => {
          expect(data.map(({type}) => type)).toContain('nitrado');
          resolve();
        }).catch(err => reject(err));
      }, 100);
    });
  });
});
