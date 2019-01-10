import AWS from 'aws-sdk';
import setCredentials from './setCredentials_AWS';

let eks = new AWS.EKS( { apiVersion : '2017-11-01' } );

const getClusterInfo = clusterName => {
    return eks.describeCluster( { name : clusterName } ).promise().then( clusterInfo => {
        return clusterInfo;
    } ).catch( err => {
        console.log( err );
    } );
};

export default getClusterInfo;
