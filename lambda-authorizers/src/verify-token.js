'use strict';

/**
 * Verify a bearer token with the help of Auth0.
 *
 * @param {String} token - A JSON Web Token (JWT) issued by Auth0
 * @param {Function} decodeJwt - Decodes the JWT to access the "kid" claim
 * @param {Function} getSigningKey - Fetches the JWKS from Auth0 to be able to verify the token signature
 * @param {Function} verifyJwt - Verifies the token using the public key, issuer and audience claims
 * @param {String} issuer - Auth0 token issuer, i.e. "who" issued the token
 * @param {String} audience - Auth0 token audience, i.e. for "whom" the token is intended
 *
 *
 * @return {Promise} Resolves with token "claim" data
 */
module.exports = async function verifyToken(
  token,
  decodeJwt,
  getSigningKey,
  verifyJwt,
  issuer,
  audience
) {
  const decoded = decodeJwt(token, { complete: true });

  if (!decoded || !decoded.header || !decoded.header.kid) {
    throw new Error('Invalid JWT');
  }

  const { publicKey, rsaPublicKey } = await getSigningKey(decoded.header.kid);
  const signingKey = publicKey || rsaPublicKey;

  return verifyJwt(token, signingKey, {
    issuer,
    audience
  });
};
