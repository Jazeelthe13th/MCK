'use strict';

var _createKubeClient = require('./createKubeClient');

var _createKubeClient2 = _interopRequireDefault(_createKubeClient);

var _createConfigMap = require('./createConfigMap');

var _createConfigMap2 = _interopRequireDefault(_createConfigMap);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _config = require('./config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_fs2.default);

var testKubeClient = async function testKubeClient() {
    var client = await (0, _createKubeClient2.default)('TestEKSCluster');
    //let configMap = await createConfigMap( 'arn:aws:iam::786796469737:role/TestEKSCluster-worker-nodes-NodeInstanceRole-1XG7ZTWKCNFV5' )
    //let config = await fs.writeFileAsync( 'config.json' , JSON.stringify( configMap , null , 4 ) ).catch( err => console.log( err ) );
    var ns = await client.api.v1.namespaces('kube-system').configmaps.post({ body: _config2.default });
    //console.log( ns.body.items[0] );
    console.log(ns);
};

testKubeClient();