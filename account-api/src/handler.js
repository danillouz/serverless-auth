'use strict';

const REQUIRED_SCOPE = 'get:profile';

/**
 * Lambda APIG proxy integration that gets the user profile.
 *
 * @param {Object} event - HTTP input: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 *
 * @return {Object} HTTP output: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format
 */
module.exports.getProfile = async event => {
  try {
    const { authorizer = {} } = event.requestContext;
    const { scope = '' } = authorizer;

    // "scope" is a String
    // When more than one scopes are present in the String, they are space separated
    // For example: "get:profile update:profile"
    const hasScope = scope.split(' ').includes(REQUIRED_SCOPE);
    if (!hasScope) {
      const err = new Error('Forbidden');
      err.code = 403;
      err.info = 'scope "get:profile" is required';

      throw err;
    }

    const profileData = {
      name: 'Daniël'
    };

    return {
      statusCode: 200,
      body: JSON.stringify(profileData)
    };
  } catch (err) {
    const statusCode = err.code || 500;

    return {
      statusCode,
      body: JSON.stringify({
        message: err.message,
        info: err.info
      })
    };
  }
};
