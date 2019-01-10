'use strict';

var _createKubeClient = require('./createKubeClient');

var _createKubeClient2 = _interopRequireDefault(_createKubeClient);

var _readYamlPromise = require('read-yaml-promise');

var _readYamlPromise2 = _interopRequireDefault(_readYamlPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createService = async function createService() {
    var clientAndServiceConfig = await Promise.all([(0, _createKubeClient2.default)('TestEKSCluster'), (0, _readYamlPromise2.default)('test-service.yaml').then(function (data) {
        return data;
    })]);
    var service = await clientAndServiceConfig[0].api.v1.namespaces('default').services.post({ body: clientAndServiceConfig[1] });
    console.log(service);
};

createService();