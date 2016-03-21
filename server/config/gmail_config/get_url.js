var fs = require('fs');
var googleAuth = require('google-auth-library');



  function getAuthorizationUrl(cb) {
    // Load client secrets
    fs.readFile(__dirname + '/../../client_secret.json', function(err, data) {
      if (err) {
        return cb(err);
      }
      var credentials = JSON.parse(data);
      var clientSecret = credentials.installed.client_secret;
      var clientId = credentials.installed.client_id;
      var redirectUrl = credentials.installed.redirect_uris[0];
      var auth = new googleAuth();
      var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

      var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.send']
      });
      return cb(null, authUrl);
    });
  }

  getAuthorizationUrl(function(err, url) {
    if (err) {
      console.log('err:', err);
    } else {
      console.log('Authorization url is:\n', url);
    }
  });
