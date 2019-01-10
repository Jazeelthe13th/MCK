'use strict';

var _require = require('@google-cloud/storage'),
    Storage = _require.Storage;

process.env.GOOGLE_APPLICATION_CREDENTIALS = '/home/jaseel/AMP-POC-Codes/nextlab-217509-2b77846e835f.json';

var downloadBlob = async function downloadBlob(bucketName, srcFilename, destFileName) {

    var storage = new Storage();

    var options = {
        destination: destFileName
    };

    srcFilename = srcFilename;

    var download = await storage.bucket(bucketName).file(srcFilename).download({ destination: destFileName });
    console.log('gs://' + bucketName + '/' + srcFilename + ' downloaded to ' + destFileName + '.');
};

var source = 'ProductData/InputPDF/2018-11-22/08:25:37/SMITH_John_SOA_ Updated4.pdf';
var dest = '/home/jaseel/DownloadedFiles/output.pdf';
var bucket = 'ampsydney';

downloadBlob(bucket, source, dest).catch(function (err) {});