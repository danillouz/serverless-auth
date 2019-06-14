'use strict';

/**
 * Lambda APIG proxy integration that gets the user profile.
 *
 * @return {Object} HTTP output
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
