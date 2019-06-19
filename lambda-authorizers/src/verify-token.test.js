'use strict';

const verifyToken = require('./verify-token');

describe('verifyToken(token, decodeJwt, getSigningKey, verifyJwt, issuer, audience)', () => {
  test('rejects when "kid" claim is not present in decoded token', async () => {
    const decodeJwt = () => {
      return {
        header: {}
      };
    };

    try {
      await verifyToken(
        undefined,
        decodeJwt,
        undefined,
        undefined,
        undefined,
        undefined
      );
    } catch (err) {
      expect(err).toEqual(new Error('Invalid JWT'));
    }
  });

  test('resolves with "sub" and "scope" claims when token is verified', async () => {
    const decodeJwt = () => {
      return {
        header: {
          kid: '9876'
        }
      };
    };

    const getSigningKey = () => Promise.resolve({});

    const clientId = '11223344';
    const sub = `${clientId}@clients`;
    const scope = 'get:profile';
    const verifyJwt = () =>
      Promise.resolve({
        iss: 'https://tenant.eu.auth0.com/',
        sub,
        aud: 'https://api.com/test',
        iat: 0,
        exp: 0,
        azp: clientId,
        scope,
        gty: 'client-credentials'
      });

    const result = await verifyToken(
      undefined,
      decodeJwt,
      getSigningKey,
      verifyJwt,
      undefined,
      undefined
    );

    expect(result.sub).toEqual(sub);
    expect(result.scope).toEqual(scope);
  });
});
