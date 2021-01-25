// Libraries to sign tokens
const jwt = require('jsonwebtoken');
const fs = require('fs');
const express = require('express');
const app = express();
require('dotenv').config();
var request = require('request');
const path = require('path');

module.exports = {
    getAppleToken: function () {
        const private_key = fs.readFileSync('./keys/apple_private_key.p8').toString(); // read your private key from your file system
        const team_id = process.env.APPLE_TEAM_ID;
        const key_id = process.env.APPLE_KEY_ID;
        const token = jwt.sign({}, private_key, {
          algorithm: 'ES256',
          expiresIn: '180d',
          issuer: team_id,
          header: {
            alg: 'ES256',
            kid: key_id
          }
        });
        searchApple(token);
    },
}

function searchApple(token) {
    var url = 'https://api.music.apple.com/v1/catalog/ca/search?term=james+brown&limit=2&types=artists,albums';
    var options = {
        url: url,
        headers: { 'Authorization': 'Bearer ' + token },
        json: true
      };
    request.get(options, function(error, response, body) {
      console.log(body);
    });
}