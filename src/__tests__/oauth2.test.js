/**
 * @jest-environment node
 */
const httpCustomer = require('httpCustomer');

const client = httpCustomer();
const guildId = '695309211608940674';

describe('endpoints involving oAuth2', () => {
  beforeEach(async () => {
    await client.get('/login');
  });

  it('creates a user and authenticates with Discord', async () => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        client.get('/api/is-authenticated').then(({data}) => {
          expect(data).toBe(true);
          resolve();
        }).catch(err => reject(err));
      }, 100);
    });
  });

  describe('integration with nitrado', () => {
    beforeEach(async () => {
      await client.get(`/guilds/${guildId}/add-service/nitrado`);
    });

    it('creates an oauth2link of type nitrado', async () => {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          client.get(`/api/guilds/${guildId}/oauth2-links`).then(({data}) => {
            expect(data.map(({type}) => type)).toContain('nitrado');
            resolve();
          }).catch(err => reject(err));
        }, 100);
      });
    });

    it('allows user to list their nitrado services', async () => {
      const res = await client.get(`/api/guilds/${guildId}/nitrado/services`);
      expect(res.data.status).toBe('success');
    });
  });

});
