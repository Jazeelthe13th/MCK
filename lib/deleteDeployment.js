'use strict';

var _createKubeClient = require('./createKubeClient');

var _createKubeClient2 = _interopRequireDefault(_createKubeClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var deleteDeployment = async function deleteDeployment() {
    var client = await (0, _createKubeClient2.default)('TestEKSCluster');
    var deployment = await client.apis.apps.v1.namespaces('default').deployments('test-deployment').delete();
    console.log(deployment);
};

deleteDeployment();