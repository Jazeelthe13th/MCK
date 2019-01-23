'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _setCredentials_AWS = require('./setCredentials_AWS');

var _setCredentials_AWS2 = _interopRequireDefault(_setCredentials_AWS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _setCredentials_AWS2.default)(/* Credentials here */ );
_awsSdk2.default.config.update({ region: 'us-east-1' });

var ec2 = new _awsSdk2.default.EC2({ apiVersion: '2016-11-15' });

var createKeyPair = function createKeyPair(keyName) {
    return ec2.createKeyPair({ KeyName: keyName }).promise().then(function (key) {
        return key;
    }).catch(function (err) {
        console.log(err);
    });
};

exports.default = createKeyPair;