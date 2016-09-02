# Read Me

Issues opened on:

- [Stack Overflow](http://stackoverflow.com/questions/39293763/errors-uploading-chunked-images-to-twitter-via-oauth-io)
- [Twitter Community](https://twittercommunity.com/t/errors-uploading-chunked-images-to-twitter-via-oauth-io/73357)

## Problem Description

We are unable to reliably upload images to Twitter.

Twitter has a REST API endpoint for [uploading chunked images](https://dev.twitter.com/rest/media/uploading-media). We are using [OAuth.io](https://oauth.io) ([documentation here](http://docs.oauth.io/)) to interact with Twitter. We are uploading the image as a base64 string.

If we upload an image in a single chunk, then the image uploads to Twitter without any problem. However, if we split the same image into multiple chunks, then Twitter *may*:

1. refuse to upload the image, informing us that the `Segments do not add up to provided total file size` once the [`FINALIZE`](https://dev.twitter.com/rest/reference/post/media/upload-finalize) command is called;
2. accept the the image, but display a corrupted image in the tweet.

The error behavior varies based on the individual file used and the chunk size of our upload. However, we have not been able to determine any viable rules to guarantee success, and certain files seem to be more error prone than others.

Without the ability to introspect what OAuth.io is POSTing or what Twitter is receiving, we are unable to determine where the problem may be occurring.

## Minimum Viable Example (MVE) Explanation

**NB: no messages are displayed on the MVE. Please use your browser's developer tools to see messages sent to the console, as well as the network tab to see calls made to OAuth.io.**

The MVE loads two images as base64 strings.

The image of the warrior (originally found [here](http://jsfiddle.net/PAEz/XfDUS/) without license, and used without permission) demonstrates the first error behavior, and will be rejected by Twitter.

The image of the duck (found on Wikipedia with a CC License) demonstrates the second error, and will successfully upload but will be corrupted in the process.

The warrior image is uploaded as a 5332 character base64-string, split into two equal 2666 character base64-string chunks when demonstrating the error. The duck is uploaded as a 12100 character base64-string, split into two 6050 character base64-string chunks when demonstrating the error.

The MVE presents the user with seven buttons.

The first button will prompt you to log into Twitter (using your own account) and subsequently authenticate the example site with Twitter, allowing the site to upload images to your account.

There are three buttons for each of the images described above.

The first button in the image set will successfully upload the image in a single API call to Twitter, demonstrating that we have the correct image size, and that the string we are using can be converted from base64 by Twitter.

The second button in the image set will upload the image in chunks, using the chunk length detailed above, demonstrating the issues described at the top of the page.

The third button also uploads in chunks, but selects a different chunk length (2000 for the warrior, 6000 for the duck), causing the errors to be avoided.

## Using the Minimum Viable Example (MVE)

Browse to [our MVE site](https://jambonsw.github.io/twitter-media-upload-split-error-mve/).

Scroll to the bottom of the page to find the buttons described above.

Login using the top button.

Use any of the buttons in the image sets to upload (or attempt to upload) the images.
