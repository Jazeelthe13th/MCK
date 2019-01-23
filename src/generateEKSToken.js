import { exec } from 'child-process-promise';
import setCredentials from './setCredentials_AWS';
import AWS from 'aws-sdk';

setCredentials( /* Credentials here */  );
AWS.config.update( { region : 'us-east-1' } );


//Using Child Process to generate token
const generateToken = clusterName => {
    return exec( `aws-iam-authenticator token -i ${ clusterName }` ).then( result => {
        if( result.stderr ) {
            throw result.stderr;
        }
        let stdout = JSON.parse( result.stdout );
        return stdout.status.token;
    } ).catch( err => {
        console.log( err );
    } );
};

export default generateToken;