'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _kubernetesClient = require('kubernetes-client');

var _createKubeConfig = require('./createKubeConfig');

var _createKubeConfig2 = _interopRequireDefault(_createKubeConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Promise to create a new client
var createClientPromise = function createClientPromise(Client, config) {
    return new Promise(function (resolve) {
        resolve({ Client: Client, config: config });
    });
};

// Create a new client based on newly generated KubeConfig  
var createClient = function createClient(Client, config) {
    return createClientPromise(Client, config).then(function (kube) {
        return new kube.Client({ config: kube.config.fromKubeconfig('awsKubeConfigData'), version: '1.10' });
    }).catch(function (err) {
        console.log(err);
    });
};

//Load Config file and create Client
var createKubeClient = async function createKubeClient(clusterName) {
    var readyKubeConfig = await (0, _createKubeConfig2.default)(clusterName);
    return await createClient(_kubernetesClient.Client, _kubernetesClient.config);
};

exports.default = createKubeClient;