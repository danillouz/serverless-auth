'use strict';

/**
 * Lambda APIG proxy integration that gets the user profile.
 *
 * @return {Object} HTTP output: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-output-format
 */
module.exports.getProfile = async () => {
  const profileData = {
    name: 'Daniël'
  };

  return {
    statusCode: 200,
    body: JSON.stringify(profileData)
  };
};
