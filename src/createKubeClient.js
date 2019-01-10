import { Client } from 'kubernetes-client';
import  { config } from 'kubernetes-client';
import createKubeConfig from './createKubeConfig';

// Promise to create a new client
const createClientPromise = ( Client , config ) => {
    return new Promise( resolve => {
        resolve ( { Client , config } );
    } );
};

// Create a new client based on newly generated KubeConfig  
const createClient = ( Client , config ) => {
    return createClientPromise( Client , config ).then( kube => {
        return new kube.Client( { config : kube.config.fromKubeconfig( 'awsKubeConfigData' ) , version : '1.10' } );
    } )
    .catch( err => {
        console.log( err );
    } );
};

//Load Config file and create Client
const createKubeClient = async clusterName => {
    let readyKubeConfig = await createKubeConfig( clusterName );
    return await createClient( Client , config );
};

export default createKubeClient;