'use strict';

var _createKubeClient = require('./createKubeClient');

var _createKubeClient2 = _interopRequireDefault(_createKubeClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getService = async function getService() {
    var client = await (0, _createKubeClient2.default)('TestEKSCluster');
    var service = await client.api.v1.namespaces('default').services('test-service').get();
    console.log(service);
    console.log(service.body.status.loadBalancer.ingress);
};

getService();