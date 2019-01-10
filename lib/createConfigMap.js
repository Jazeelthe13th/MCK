'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _readYamlPromise = require('read-yaml-promise');

var _readYamlPromise2 = _interopRequireDefault(_readYamlPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_fs2.default);

var createConfigMap = function createConfigMap(roleArn) {
    return (0, _readYamlPromise2.default)('aws-auth-cm.yaml').then(function (data) {
        data.data.mapRoles = data.data.mapRoles.replace('<ARN>', roleArn);
        return data;
    }).catch(function (err) {
        console.log(err);
    });
};

exports.default = createConfigMap;