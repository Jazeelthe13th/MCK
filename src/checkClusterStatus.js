import AWS from 'aws-sdk';
import setCredentials from './setCredentials_AWS';

setCredentials( 'AKIA3OMFZLXUVA6TU3OJ' , 'w19JaY5StCPMcsSHa4BkilGxB62MFPOVugUYXnKD' );
AWS.config.update( { region : 'us-east-1' } );

let eks = new AWS.EKS( { apiVersion : '2017-11-01' } );

//Checks status of cluster on creation at intervals and returns final status
const checkClusterStatusPromise = ( params , interval ) => {
    return new Promise( ( resolve , reject ) => {
        //Resolves or Rejects Promise based on cluster status
        const statusCheck = setInterval( () => {
            eks.describeCluster( params ).promise().then( clusterInfo => {
                if( clusterInfo.cluster.status === 'FAILED' ) {
                    clearInterval( statusCheck );
                    reject( Error( 'Failed Cluster Creation' ) );
                }
                else if ( clusterInfo.cluster.status === 'ACTIVE' ) {
                    console.log( 'Cluster active!');
                    clearInterval( statusCheck );
                    resolve( clusterInfo );
                }
                //If cluster is neither 'ACTIVE' nor 'FAILED', it keeps checking on intervals 
                console.log('Cluster is creating');
            } ).catch( err => {
                reject( err );
            } );
        }, interval )
    } );
};

//Checks cluster status on intervals and returns final status
const checkClusterStatus = ( clusterName , interval ) => {
    return checkClusterStatusPromise( { name : clusterName } , interval ).then( clusterInfo => {
        return clusterInfo;
    } ).catch( err => {
        console.log( err );
    } );
};


export default checkClusterStatus; 