'use strict';

const util = require('util');
const jwt = require('jsonwebtoken');

const verifyJwt = util.promisify(jwt.verify);

/**
 * Verify a bearer token with the help of Auth0.
 *
 * @param {Object} jwksClient - JSON Web Key Set Client that fetches a public key from Auth0 to verify the token signature
 * @param {String} issuer - Auth0 token issuer, i.e. "who" issued the token
 * @param {String} audience - Auth0 token audience, i.e. for "whom" the token is intended
 * @param {String} token - A JSON Web Token (JWT) issued by Auth0
 *
 * @return {Promise} Resolves with token "claim" data
 */
module.exports = async function verifyToken(
  jwksClient,
  issuer,
  audience,
  token
) {
  const decoded = jwt.decode(token, { complete: true });

  if (!decoded || !decoded.header || !decoded.header.kid) {
    throw new Error('Invalid JWT');
  }

  const getSigningKey = util.promisify(jwksClient.getSigningKey);
  const { publicKey, rsaPublicKey } = await getSigningKey(decoded.header.kid);
  const signingKey = publicKey || rsaPublicKey;

  return verifyJwt(token, signingKey, {
    issuer,
    audience
  });
};
