'use strict';

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _setCredentials_AWS = require('./setCredentials_AWS');

var _setCredentials_AWS2 = _interopRequireDefault(_setCredentials_AWS);

var _createEKSRole = require('./createEKSRole');

var _createEKSRole2 = _interopRequireDefault(_createEKSRole);

var _createEKSVPC = require('./createEKSVPC');

var _createEKSVPC2 = _interopRequireDefault(_createEKSVPC);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _setCredentials_AWS2.default)('AKIA3OMFZLXUVA6TU3OJ', 'w19JaY5StCPMcsSHa4BkilGxB62MFPOVugUYXnKD');
_awsSdk2.default.config.update({ region: 'us-east-1' });

var eks = new _awsSdk2.default.EKS({ apiVersion: '2017-11-01' });

//Checks status of cluster creation at intervals and returns final status
var checkClusterStatusPromise = function checkClusterStatusPromise(params, interval) {
    return new Promise(function (resolve, reject) {
        //Resolves or Rejects Promise based on cluster status
        var statusCheck = setInterval(function () {
            eks.describeCluster(params).promise().then(function (clusterInfo) {
                if (clusterInfo.cluster.status === 'FAILED') {
                    clearInterval(statusCheck);
                    reject(Error('Failed Cluster Creation'));
                } else if (clusterInfo.cluster.status === 'ACTIVE') {
                    clearInterval(statusCheck);
                    resolve(clusterInfo);
                }
                //If cluster is neither 'ACTIVE' nor 'FAILED', it keeps checking on intervals 
                console.log('Cluster Creating');
            }).catch(function (err) {
                reject(err);
            });
        }, interval);
    });
};

//Checks cluster status on intervals and returns final status
var checkClusterStatus = function checkClusterStatus(params, interval) {
    return checkClusterStatusPromise(params, interval).then(function (clusterInfo) {
        return clusterInfo;
    }).catch(function (err) {
        console.log(err);
    });
};

//Set up Role, VPC, Subnets, Security Groups and Cluster
var setupEKSCluster = async function setupEKSCluster() {

    var preRequisites = await Promise.all([(0, _createEKSRole2.default)(), (0, _createEKSVPC2.default)()]);

    //Extracting parameters from the created resources
    var role = preRequisites[0].Role.Arn;
    var subnets = preRequisites[1][2].OutputValue.split(',');
    var securityGroups = preRequisites[1][0].OutputValue.split(',');

    var eksParams = {
        name: 'TestEKSCluster',
        resourcesVpcConfig: {
            subnetIds: subnets,
            securityGroupIds: securityGroups
        },
        roleArn: role
    };
    //Creating Cluster
    var cluster = await eks.createCluster(eksParams).promise();
    console.log(cluster);
    //Getting Final Cluster Status
    var finalStatus = await checkClusterStatus({ name: cluster.cluster.name }, 35000);
    console.log(finalStatus);
};

setupEKSCluster().catch(function (err) {
    console.log(err);
});