import createKubeClient from './createKubeClient';
import readYaml from 'read-yaml-promise';

const createDeployment = async () => {
    let clientAndDeploymentConfig = await Promise.all( [ createKubeClient( 'TestEKSCluster' ), readYaml( 'test-deployment.yaml' ).then( data => data ) ] );
    let deployment = await clientAndDeploymentConfig[0].apis.apps.v1.namespaces('default').deployments.post( { body : clientAndDeploymentConfig[1] } );
    console.log( deployment );
};

createDeployment();