const {Storage} = require('@google-cloud/storage');

process.env.GOOGLE_APPLICATION_CREDENTIALS = '/home/jaseel/AMP-POC-Codes/nextlab-217509-2b77846e835f.json'

let downloadBlob = async ( bucketName, srcFilename, destFileName ) => {
    
    const storage = new Storage();

    const options = {
        destination : destFileName,
    };

    srcFilename = srcFilename;

    let download = await storage.bucket(bucketName).file(srcFilename).download({destination:destFileName});
    console.log(`gs://${bucketName}/${srcFilename} downloaded to ${destFileName}.`);
}

let source = 'ProductData/InputPDF/2018-11-22/08:25:37/SMITH_John_SOA_ Updated4.pdf';
let dest = '/home/jaseel/DownloadedFiles/output.pdf';
let bucket = 'ampsydney';

downloadBlob( bucket , source , dest ).catch( err => {});