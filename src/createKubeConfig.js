import fs from 'fs';
import { Promise } from 'bluebird'; 
import generateToken from './generateEKSToken';
import getClusterInfo from './describeCluster';

//Promisifying fs module
Promise.promisifyAll(fs);

//Plugging in input parameters into KubeConfig
const createConfig = ( inputData ) => {
    return fs.readFileAsync( 'awsKubeConfigTemplate' , 'utf-8' ).then( data => {
        data = JSON.parse( data );
        data.clusters[0].cluster.server = inputData[1].cluster.endpoint;
        data.clusters[0].cluster['certificate-authority-data'] = inputData[1].cluster.certificateAuthority.data;
        data.users[0].user.token = inputData[0];
        data = JSON.stringify( data );
        return data;
    } ).catch( err => {
        console.log( err );
    } );
};

//Writing KubeConfig file
const writeKubeConfig = data => {
    return fs.writeFileAsync( 'awsKubeConfigData', data ).catch(err => console.log( err ));
}

//Preparing KubeConfig file
const createKubeConfig = async clusterName => {
    let requiredData = await Promise.all( [ generateToken( clusterName ) , getClusterInfo( clusterName ) ] );
    let configData = await createConfig( requiredData );
    return await writeKubeConfig( configData );
};

export default createKubeConfig;