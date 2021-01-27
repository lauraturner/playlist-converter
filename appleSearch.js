// Libraries to sign tokens
const jwt = require('jsonwebtoken');
const fs = require('fs');
const express = require('express');
const app = express();
require('dotenv').config();
var request = require('request');
const path = require('path');
const { response } = require('express');
const querystring = require('querystring');

module.exports = {
    // Using the Apple ENV variables create a Apple JWT 
    createAppleJWT: function () {
        const private_key = fs.readFileSync('./keys/apple_private_key.p8').toString();
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
        return token;
    },

    // Use the token to make an API requst to apple to check that the JWT works 
    checkAppleToken: function(token) {
        var url = 'https://api.music.apple.com/v1/catalog/ca/songs/203709340';
        var options = {
            url: url,
            headers: { 'Authorization': 'Bearer ' + token },
            json: true
        };
        return new Promise(function (resolve, reject) {
            request.get(options, function(error, response, body) {
                if (error) reject(error);
                resolve(response.statusCode);
            });
        });
    },

    applePlaylistSearch: function(search, token) {
        const encodedSearch =  search.replace(' ', '+');
        var url = `https://api.music.apple.com/v1/catalog/ca/search?term=${encodedSearch}&limit=5&types=playlists`;
        var options = {
            url: url,
            headers: { 'Authorization': token },
            json: true
        };
        return new Promise(function (resolve, reject) {
            request.get(options, function(error, response, body) {
                if (error) reject(error);
                console.log(body);
                resolve(body.results.playlists.data);
            });
        });
    },
}