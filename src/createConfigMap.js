import Promise from 'bluebird';
import fs from 'fs';
import readYaml from 'read-yaml-promise';

Promise.promisifyAll( fs );

const createConfigMap = roleArn => {
    return readYaml( 'aws-auth-cm.yaml' ).then( data => {
        data.data.mapRoles = data.data.mapRoles.replace( '<ARN>' , roleArn );
        return data;
    } ).catch( err => { 
        console.log( err );
    } );
};

export default createConfigMap;

