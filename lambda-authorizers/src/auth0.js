'use strict';

const util = require('util');

const jwt = require('jsonwebtoken');
const jwksRSA = require('jwks-rsa');

const getToken = require('./get-token');
const verifyToken = require('./verify-token');

const { JWKS_URI, TOKEN_ISSUER, AUDIENCE } = process.env;

const jwksClient = jwksRSA({ cache: true, rateLimit: true, jwksUri: JWKS_URI });
const getSigningKey = util.promisify(jwksClient.getSigningKey);
const verifyJwt = util.promisify(jwt.verify);

/**
 * AWS API Gateway Lambda Authorizer that uses Auth0 as the third party auth provider.
 *
 * This Lambda will:
 *  1. Extract the bearer token from the "Authorization" request header.
 *  2. Fetch the JWKS from Auth0 and verify the token signature, issuer and audience claims.
 *  3. Return an IAM Policy document with "Effect" set to "Allow" when the token has been verified.
 *
 * @param {Object} event - HTTP input
 *
 * @return {Promise} Resolves with an AWS IAM Policy document
 */
module.exports.verifyBearer = async event => {
  try {
    const token = getToken(event);
    const verifiedData = await verifyToken(
      token,
      jwt.decode,
      getSigningKey,
      verifyJwt,
      TOKEN_ISSUER,
      AUDIENCE
    );

    const userId = verifiedData.sub;
    const authResponse = {
      principalId: userId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: event.methodArn
          }
        ]
      },

      // NOTE!
      // You can NOT set a JSON object or array as a valid value of any key in the context object
      // It must be either a String, Number or Boolean
      context: { scope: verifiedData.scope }
    };
    return authResponse;
  } catch (err) {
    console.log('Authorizer Error: ', err); // eslint-disable-line no-console

    // Error MUST be "Unauthorized" EXACTLY for APIG to return a 401
    throw new Error('Unauthorized');
  }
};
