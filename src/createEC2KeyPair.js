import AWS from 'aws-sdk';
import setCredentials from './setCredentials_AWS';

setCredentials( 'AKIA3OMFZLXUVA6TU3OJ' , 'w19JaY5StCPMcsSHa4BkilGxB62MFPOVugUYXnKD' );
AWS.config.update( { region : 'us-east-1' } );

let ec2 = new AWS.EC2( { apiVersion : '2016-11-15' } );

const createKeyPair = keyName => {
    return ec2.createKeyPair( { KeyName : keyName } ).promise().then( key => {
        return key;
    } ).catch( err => {
        console.log( err );
    } );
};

export default createKeyPair;