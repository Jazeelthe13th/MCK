import createKubeClient from './createKubeClient';

const getDeployment = async () => {
    let client = await createKubeClient( 'TestEKSCluster' );
    let deployment = await client.apis.apps.v1.namespaces('default').deployments('test-deployment').get();
    console.log( deployment );
};

getDeployment();