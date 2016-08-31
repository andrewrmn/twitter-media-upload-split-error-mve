/* globals OAuth */
/* eslint func-names: "off" */
/* eslint no-console: "off" */

var tweet;
var twitterLogin;

twitterLogin = function () {
  var oAuthRequest;
  OAuth.initialize('bbii4DU7QS7yQZH55rqC0acFz0s');
  oAuthRequest = OAuth.create('twitter');
  if (!oAuthRequest) {
    OAuth.popup(
      'twitter', { cache: true }
    ).done(function (oauthResult) {
      return oauthResult.get(
        'https://api.twitter.com/1.1/account/verify_credentials.json'
      );
    });
    return OAuth.create('twitter');
  }
  return oAuthRequest;
};

tweet = function (oAuthRequest, status, mediaIdString) {
  oAuthRequest.post(
    '/1.1/statuses/update.json',
    { data: {
      status: status,
      media_ids: mediaIdString
    } }
  ).done(function (postResponse) {
    console.log('Twitter created tweet with media');
    console.log(postResponse);
  }).fail(function (err) {
    console.log('Twitter could not create tweet');
    console.log(err);
  });
};
