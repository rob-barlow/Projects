const express = require('express')
const request = require('request');
const dotenv = require('dotenv');
const cors = require("cors");

const port = 5000
global.access_token = ''
global.refresh_token = ''
global.expires_in = 0
global.token_acquired_time = 0


dotenv.config()

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET

var spotify_redirect_uri = 'http://127.0.0.1:3000/auth/callback'

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}));


app.get('/auth/login', (req, res) => {

  var scope = "streaming user-read-email user-read-private"
  var state = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: spotify_redirect_uri,
    state: state
  })

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
  console.log('redirecting to spotify login page')
})

app.get('/auth/callback', (req, res) => {
  console.log('got callback from spotify login page')

  var code = req.query.code;

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: spotify_redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      refresh_token = body.refresh_token;
      expires_in = body.expires_in;
      token_acquired_time = Date.now();
      // console.log('body is: ' + JSON.stringify(body))
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send('OK')
    }
  });

})

app.get('/auth/token', (req, res) => {
  if (access_token === '') {
    console.log('no access token returned')
  }

  if ( Date.now() - token_acquired_time > expires_in * 1000) {
    console.log('access token expired, refreshing')
    refreshAccessToken();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ access_token: access_token})
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Listening at http://127.0.0.1:${port}`)
})

function refreshAccessToken() {
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      refresh_token = body.refresh_token;
      expires_in = body.expires_in;
      token_acquired_time = Date.now();
      console.log('body is: ' + JSON.stringify(body))
    }
  });
}