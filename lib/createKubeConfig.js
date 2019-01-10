'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bluebird = require('bluebird');

var _generateEKSToken = require('./generateEKSToken');

var _generateEKSToken2 = _interopRequireDefault(_generateEKSToken);

var _describeCluster = require('./describeCluster');

var _describeCluster2 = _interopRequireDefault(_describeCluster);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Promisifying fs module
_bluebird.Promise.promisifyAll(_fs2.default);

//Plugging in input parameters into KubeConfig
var createConfig = function createConfig(inputData) {
    return _fs2.default.readFileAsync('awsKubeConfigTemplate', 'utf-8').then(function (data) {
        data = JSON.parse(data);
        data.clusters[0].cluster.server = inputData[1].cluster.endpoint;
        data.clusters[0].cluster['certificate-authority-data'] = inputData[1].cluster.certificateAuthority.data;
        data.users[0].user.token = inputData[0];
        data = JSON.stringify(data);
        return data;
    }).catch(function (err) {
        console.log(err);
    });
};

//Writing KubeConfig file
var writeKubeConfig = function writeKubeConfig(data) {
    return _fs2.default.writeFileAsync('awsKubeConfigData', data).catch(function (err) {
        return console.log(err);
    });
};

//Preparing KubeConfig file
var createKubeConfig = async function createKubeConfig(clusterName) {
    var requiredData = await _bluebird.Promise.all([(0, _generateEKSToken2.default)(clusterName), (0, _describeCluster2.default)(clusterName)]);
    var configData = await createConfig(requiredData);
    return await writeKubeConfig(configData);
};

exports.default = createKubeConfig;