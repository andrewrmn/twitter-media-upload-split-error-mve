/* globals OAuth */
/* eslint func-names: "off" */
/* eslint no-console: "off" */

var tweet;
var twitterChunkedUpload;
var twitterLogin;
var twitterSimpleUpload;

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

twitterSimpleUpload = function (base64ImageString, fileSize) {
  var oAuthRequest = twitterLogin();
  var mediaIdString;
  oAuthRequest.post(
    'https://upload.twitter.com/1.1/media/upload.json',
    { data: {
      command: 'INIT',
      media_type: 'image/jpeg',
      total_bytes: fileSize
    } }
  ).done(function (twitterResponse) {
    // INIT successfully sent
    // upload the one and only chunk to twitter
    mediaIdString = twitterResponse.media_id_string;
    oAuthRequest.post(
      'https://upload.twitter.com/1.1/media/upload.json',
      {
        headers: { 'Content-Transfer-Encoding': 'base64' },
        data: {
          command: 'APPEND',
          media_data: base64ImageString,
          media_id: mediaIdString,
          segment_index: 0
        }
      }
    ).done(function () {
      // APPEND successful
      oAuthRequest.post(
        'https://upload.twitter.com/1.1/media/upload.json',
        { data: {
          command: 'FINALIZE',
          media_id: mediaIdString
        } }
      ).done(function () {
        // FINALIZE successful
        tweet(oAuthRequest, 'Single Append!', mediaIdString);
      }).fail(function (err) {
        console.log('FINALIZE Failed');
        console.log(err);
      });
    }).fail(function (err) {
      console.log('APPEND Failed');
      console.log(err);
    });
  }).fail(function (err) {
    console.log('INIT Failed');
    console.log(err);
  });
};

twitterChunkedUpload = function (base64ImageString, fileSize, chunkSize) {
  var mediaIdString;
  var oAuthRequest = twitterLogin();
  oAuthRequest.post(
    'https://upload.twitter.com/1.1/media/upload.json',
    { data: {
      command: 'INIT',
      media_type: 'image/jpeg',
      total_bytes: fileSize
    } }
  ).done(function (twitterResponse) {
    // INIT successfully sent
    // upload the one and only chunk to twitter
    mediaIdString = twitterResponse.media_id_string;
    oAuthRequest.post(
      'https://upload.twitter.com/1.1/media/upload.json',
      {
        headers: { 'Content-Transfer-Encoding': 'base64' },
        data: {
          command: 'APPEND',
          media_data: base64ImageString.slice(0, chunkSize),
          media_id: mediaIdString,
          segment_index: 0
        }
      }
    ).done(function () {
      // first APPEND successful
      oAuthRequest.post(
        'https://upload.twitter.com/1.1/media/upload.json',
        {
          headers: { 'Content-Transfer-Encoding': 'base64' },
          data: {
            command: 'APPEND',
            media_data: base64ImageString.slice(
              chunkSize,
              base64ImageString.length
            ),
            media_id: mediaIdString,
            segment_index: 1
          }
        }
      ).done(function () {
        // second APPEND successful
        oAuthRequest.post(
          'https://upload.twitter.com/1.1/media/upload.json',
          { data: {
            command: 'FINALIZE',
            media_id: mediaIdString
          } }
        ).done(function () {
          // FINALIZE successful
          tweet(
            oAuthRequest,
            'Chunked (size ' + chunkSize + ') Append!',
            mediaIdString
          );
        }).fail(function (err) {
          console.log('FINALIZE Failed');
          console.log(err);
        });
      }).fail(function (err) {
        console.log('second APPEND Failed');
        console.log(err);
      });
    }).fail(function (err) {
      console.log('first APPEND Failed');
      console.log(err);
    });
  }).fail(function (err) {
    console.log('INIT Failed');
    console.log(err);
  });
};
