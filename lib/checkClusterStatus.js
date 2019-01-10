'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _setCredentials_AWS = require('./setCredentials_AWS');

var _setCredentials_AWS2 = _interopRequireDefault(_setCredentials_AWS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _setCredentials_AWS2.default)('AKIA3OMFZLXUVA6TU3OJ', 'w19JaY5StCPMcsSHa4BkilGxB62MFPOVugUYXnKD');
_awsSdk2.default.config.update({ region: 'us-east-1' });

var eks = new _awsSdk2.default.EKS({ apiVersion: '2017-11-01' });

//Checks status of cluster on creation at intervals and returns final status
var checkClusterStatusPromise = function checkClusterStatusPromise(params, interval) {
    return new Promise(function (resolve, reject) {
        //Resolves or Rejects Promise based on cluster status
        var statusCheck = setInterval(function () {
            eks.describeCluster(params).promise().then(function (clusterInfo) {
                if (clusterInfo.cluster.status === 'FAILED') {
                    clearInterval(statusCheck);
                    reject(Error('Failed Cluster Creation'));
                } else if (clusterInfo.cluster.status === 'ACTIVE') {
                    console.log('Cluster active!');
                    clearInterval(statusCheck);
                    resolve(clusterInfo);
                }
                //If cluster is neither 'ACTIVE' nor 'FAILED', it keeps checking on intervals 
                console.log('Cluster is creating');
            }).catch(function (err) {
                reject(err);
            });
        }, interval);
    });
};

//Checks cluster status on intervals and returns final status
var checkClusterStatus = function checkClusterStatus(clusterName, interval) {
    return checkClusterStatusPromise({ name: clusterName }, interval).then(function (clusterInfo) {
        return clusterInfo;
    }).catch(function (err) {
        console.log(err);
    });
};

exports.default = checkClusterStatus;