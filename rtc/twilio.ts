require('dotenv').load();

const https = require('http');
const path = require('path');
import * as Express from 'express';
const bodyParser = require('body-parser')
const methods = require('./src/server.js');
const tokenGenerator = methods.tokenGenerator;
const makeCall = methods.makeCall;
const placeCall = methods.placeCall;
const incoming = methods.incoming;
const welcome = methods.welcome;
var twilio = require('twilio');

// Create Express TwilioServer
const TwilioServer: Express.Application = Express();

// parse application/x-www-form-urlencoded
TwilioServer.use(bodyParser.urlencoded({ extended: false }))

TwilioServer.get('/', function(request, response) {
  response.send(welcome());
});

TwilioServer.post('/', function(request, response) {
  response.send(welcome());
});

TwilioServer.get('/accessToken', function(request, response) {
  tokenGenerator(request, response);
});

TwilioServer.post('/accessToken', function(request, response) {
  tokenGenerator(request, response);
});

TwilioServer.get('/makeCall', function(request, response) {
  makeCall(request, response);
});

TwilioServer.post('/makeCall', function(request, response) {
  makeCall(request, response);
});

TwilioServer.get('/placeCall', placeCall);

TwilioServer.post('/placeCall', placeCall);

TwilioServer.get('/incoming', function(request, response) {
  response.send(incoming());
});

TwilioServer.post('/incoming', function(request, response) {
  response.send(incoming());
});

// Create an http server and run it
export default TwilioServer;