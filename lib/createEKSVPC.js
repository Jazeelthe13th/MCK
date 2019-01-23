'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _setCredentials_AWS = require('./setCredentials_AWS');

var _setCredentials_AWS2 = _interopRequireDefault(_setCredentials_AWS);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Promisifying fs to use in async/await
_bluebird2.default.promisifyAll(_fs2.default);

(0, _setCredentials_AWS2.default)(/* Credentials here */ );
_awsSdk2.default.config.update({ region: 'us-east-1' });

var cloudFormation = new _awsSdk2.default.CloudFormation({ apiVersion: '2010-05-15' });

//Read CFT and wait for Stack Creation to be complete
var createVPCStack = async function createVPCStack() {
    var cft = await _fs2.default.readFileAsync('amazon-eks-vpc-sample.yaml', 'utf-8');

    var params = {
        StackName: 'EKS-VPC',
        TemplateBody: cft
    };

    var stack = await cloudFormation.createStack(params).promise();

    return await cloudFormation.waitFor('stackCreateComplete', { StackName: stack.StackId }).promise();
};

exports.default = createVPCStack;