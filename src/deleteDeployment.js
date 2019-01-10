import createKubeClient from './createKubeClient';

const deleteDeployment = async () => {
    let client = await createKubeClient( 'TestEKSCluster' );
    let deployment = await client.apis.apps.v1.namespaces('default').deployments('test-deployment').delete();
    console.log( deployment );
};

deleteDeployment();