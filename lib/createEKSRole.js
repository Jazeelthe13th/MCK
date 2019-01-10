'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _setCredentials_AWS = require('./setCredentials_AWS');

var _setCredentials_AWS2 = _interopRequireDefault(_setCredentials_AWS);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _v = require('uuid/v1');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Setting Credentials and Region
(0, _setCredentials_AWS2.default)('AKIA3OMFZLXUVA6TU3OJ', 'w19JaY5StCPMcsSHa4BkilGxB62MFPOVugUYXnKD');
_awsSdk2.default.config.update({ region: 'us-east-1' });

//Locking IAM API Version
var iam = new _awsSdk2.default.IAM({ apiVersion: '2010-05-08' });

//Role Trust Policy Document
var rolePolicyDocument = {
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow",
        "Principal": {
            "Service": "eks.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
    }]
};

var roleParams = {
    AssumeRolePolicyDocument: JSON.stringify(rolePolicyDocument),
    RoleName: "EKSServiceRole" + (0, _v2.default)(),
    Description: "Allows EKS to manage clusters on your behalf."
};

//Creating Role and Attaching Policies
var createEKSRole = async function createEKSRole() {
    var role = await iam.createRole(roleParams).promise();
    var attachPolicies = await Promise.all([iam.attachRolePolicy({ PolicyArn: "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy", RoleName: roleParams.RoleName }).promise(), iam.attachRolePolicy({ PolicyArn: "arn:aws:iam::aws:policy/AmazonEKSServicePolicy", RoleName: roleParams.RoleName }).promise()]);
    return role;
};

exports.default = createEKSRole;