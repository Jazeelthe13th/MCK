'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _setCredentials_AWS = require('./setCredentials_AWS');

var _setCredentials_AWS2 = _interopRequireDefault(_setCredentials_AWS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eks = new _awsSdk2.default.EKS({ apiVersion: '2017-11-01' });

var getClusterInfo = function getClusterInfo(clusterName) {
    return eks.describeCluster({ name: clusterName }).promise().then(function (clusterInfo) {
        return clusterInfo;
    }).catch(function (err) {
        console.log(err);
    });
};

exports.default = getClusterInfo;