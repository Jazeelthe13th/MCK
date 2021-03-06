'use strict';

var _createKubeClient = require('./createKubeClient');

var _createKubeClient2 = _interopRequireDefault(_createKubeClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getConfigMap = async function getConfigMap() {
    var client = await (0, _createKubeClient2.default)('TestEKSCluster');
    var cm = await client.api.v1.namespaces('kube-system').configmaps('aws-auth').get();
    console.log(cm);
};

getConfigMap();