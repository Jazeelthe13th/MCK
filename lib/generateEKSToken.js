'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _childProcessPromise = require('child-process-promise');

var _setCredentials_AWS = require('./setCredentials_AWS');

var _setCredentials_AWS2 = _interopRequireDefault(_setCredentials_AWS);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _setCredentials_AWS2.default)(/* Credentials here */ );
_awsSdk2.default.config.update({ region: 'us-east-1' });

//Using Child Process to generate token
var generateToken = function generateToken(clusterName) {
    return (0, _childProcessPromise.exec)('aws-iam-authenticator token -i ' + clusterName).then(function (result) {
        if (result.stderr) {
            throw result.stderr;
        }
        var stdout = JSON.parse(result.stdout);
        return stdout.status.token;
    }).catch(function (err) {
        console.log(err);
    });
};

exports.default = generateToken;