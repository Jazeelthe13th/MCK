'use strict';

var _createKubeClient = require('./createKubeClient');

var _createKubeClient2 = _interopRequireDefault(_createKubeClient);

var _readYamlPromise = require('read-yaml-promise');

var _readYamlPromise2 = _interopRequireDefault(_readYamlPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createDeployment = async function createDeployment() {
    var clientAndDeploymentConfig = await Promise.all([(0, _createKubeClient2.default)('TestEKSCluster'), (0, _readYamlPromise2.default)('test-deployment.yaml').then(function (data) {
        return data;
    })]);
    var deployment = await clientAndDeploymentConfig[0].apis.apps.v1.namespaces('default').deployments.post({ body: clientAndDeploymentConfig[1] });
    console.log(deployment);
};

createDeployment();