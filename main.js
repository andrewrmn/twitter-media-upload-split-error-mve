/* globals OAuth */
/* eslint func-names: "off" */
/* eslint no-console: "off" */

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
