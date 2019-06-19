'use strict';

/**
 * Extracts the bearer token from the Authorization request header.
 *
 * The value of the request header MUST have the format: "Bearer TOKEN".
 * Note that "Bearer" MUST be capitalized!
 *
 * @param {Object} event - AWS APIG HTTP input
 *
 * @return {String} Token
 */
module.exports = function getToken(event) {
  if (event.type !== 'TOKEN') {
    throw new Error('Authorizer must be of type "TOKEN"');
  }

  const { authorizationToken: bearer } = event;
  if (!bearer) {
    throw new Error(
      'Authorization header with "Bearer TOKEN" must be provided'
    );
  }

  const [, token] = bearer.match(/^Bearer (.*)$/) || [];
  if (!token) {
    throw new Error('Invalid bearer token');
  }

  return token;
};
