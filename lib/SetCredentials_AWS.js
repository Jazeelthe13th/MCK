'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var setCredentials = function setCredentials(accessKey, secretKey) {
    process.env.AWS_ACCESS_KEY_ID = accessKey;
    process.env.AWS_SECRET_ACCESS_KEY = secretKey;
};

setCredentials('test');

exports.default = setCredentials;