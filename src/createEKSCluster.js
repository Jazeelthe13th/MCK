import AWS from 'aws-sdk';
import setCredentials from './setCredentials_AWS';
import createEKSRole from './createEKSRole';
import createVPCStack from './createEKSVPC';

setCredentials( /* Credentials here */  );
AWS.config.update( { region : 'us-east-1' } );

let eks = new AWS.EKS( { apiVersion : '2017-11-01' } );

//Checks status of cluster creation at intervals and returns final status
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
                    clearInterval( statusCheck );
                    resolve( clusterInfo );
                }
                //If cluster is neither 'ACTIVE' nor 'FAILED', it keeps checking on intervals 
                console.log( 'Cluster Creating' );
            } ).catch( err => {
                reject( err );
            } );
        }, interval )
    } );
};


//Checks cluster status on intervals and returns final status
const checkClusterStatus = ( params , interval ) => {
    return checkClusterStatusPromise( params , interval ).then( clusterInfo => {
        return clusterInfo;
    } ).catch( err => {
        console.log( err );
    } );
};

//Set up Role, VPC, Subnets, Security Groups and Cluster
const setupEKSCluster = async () => {

    let preRequisites = await Promise.all( [ createEKSRole() , createVPCStack() ] );
    
    //Extracting parameters from the created resources
    let role = preRequisites[0].Role.Arn;
    let subnets = preRequisites[1][2].OutputValue.split(',');
    let securityGroups = preRequisites[1][0].OutputValue.split(',');

    let eksParams = {
        name : 'TestEKSCluster',
        resourcesVpcConfig : {
            subnetIds : subnets,
            securityGroupIds : securityGroups 
        },
        roleArn : role
    };
    //Creating Cluster
    let cluster = await eks.createCluster( eksParams ).promise();
    console.log( cluster );
    //Getting Final Cluster Status
    let finalStatus = await checkClusterStatus( { name : cluster.cluster.name } , 35000 );
    console.log( finalStatus );
};

setupEKSCluster().catch( err => {
    console.log( err );
} );