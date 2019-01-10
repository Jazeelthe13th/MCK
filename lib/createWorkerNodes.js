'use strict';

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _setCredentials_AWS = require('./setCredentials_AWS');

var _setCredentials_AWS2 = _interopRequireDefault(_setCredentials_AWS);

var _createEC2KeyPair = require('./createEC2KeyPair');

var _createEC2KeyPair2 = _interopRequireDefault(_createEC2KeyPair);

var _describeCluster = require('./describeCluster');

var _describeCluster2 = _interopRequireDefault(_describeCluster);

var _createKubeClient = require('./createKubeClient');

var _createKubeClient2 = _interopRequireDefault(_createKubeClient);

var _createConfigMap = require('./createConfigMap');

var _createConfigMap2 = _interopRequireDefault(_createConfigMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_fs2.default);

(0, _setCredentials_AWS2.default)('AKIA3OMFZLXUVA6TU3OJ', 'w19JaY5StCPMcsSHa4BkilGxB62MFPOVugUYXnKD');
_awsSdk2.default.config.update({ region: 'us-east-1' });

var clusterName = 'TestEKSCluster';

var cloudFormation = new _awsSdk2.default.CloudFormation({ apiVersion: '2010-05-15' });

//Setup Worker Nodes with CFT
var createWorkerNodes = async function createWorkerNodes() {
    //Generate Key For SSH , Read Template Body
    var keyAndTemplate = await _bluebird2.default.all([(0, _createEC2KeyPair2.default)('TestEKSCluster-KeyPair'), _fs2.default.readFileAsync('amazon-eks-nodegroup.yaml', 'utf-8').then(function (data) {
        return data;
    }).catch(function (err) {
        return console.log(err);
    })]);

    //Save SSH Key
    var writeKey = _fs2.default.writeFileAsync('TestEKSCluster-KeyPair', keyAndTemplate[0].KeyMaterial).catch(function (err) {
        return console.log(err);
    });

    //Get Cluster Info to plug into CFT
    var clusterInfo = await (0, _describeCluster2.default)('TestEKSCluster');

    var params = {
        StackName: 'TestEKSCluster-worker-nodes',
        TemplateBody: keyAndTemplate[1],
        Capabilities: ['CAPABILITY_IAM'],
        Parameters: [{
            ParameterKey: 'ClusterName',
            ParameterValue: clusterInfo.cluster.name
        }, {
            ParameterKey: 'ClusterControlPlaneSecurityGroup',
            ParameterValue: clusterInfo.cluster.resourcesVpcConfig.securityGroupIds.toString()
        }, {
            ParameterKey: 'NodeGroupName',
            ParameterValue: 'TestEKS-NodeGroup'
        }, {
            ParameterKey: 'NodeAutoScalingGroupMinSize',
            ParameterValue: '1'
        }, {
            ParameterKey: 'NodeAutoScalingGroupMaxSize',
            ParameterValue: '3'
        }, {
            ParameterKey: 'NodeImageId',
            ParameterValue: 'ami-0440e4f6b9713faf6'
        }, {
            ParameterKey: 'KeyName',
            ParameterValue: keyAndTemplate[0].KeyName
        }, {
            ParameterKey: 'VpcId',
            ParameterValue: clusterInfo.cluster.resourcesVpcConfig.vpcId
        }, {
            ParameterKey: 'Subnets',
            ParameterValue: clusterInfo.cluster.resourcesVpcConfig.subnetIds.toString()
        }]
    };

    //Create the Worker Nodes
    var workerNodeStack = await cloudFormation.createStack(params).promise();

    //Wait for Completion of Creation
    var finalStatus = await cloudFormation.waitFor('stackCreateComplete', { StackName: workerNodeStack.StackId }).promise();

    //Create ConfigMap with RoleArn from stack
    var clientAndConfigMap = await _bluebird2.default.all([(0, _createKubeClient2.default)(clusterInfo.cluster.name), (0, _createConfigMap2.default)(finalStatus.Stacks[0].Outputs[0].OutputValue)]);

    //Apply ConfigMap
    var applyConfig = await clientAndConfigMap[0].api.v1.namespaces('kube-system').configmaps.post({ body: clientAndConfigMap[1] });
    console.log(applyConfig);
};

createWorkerNodes().catch(function (err) {
    return console.log(err);
});