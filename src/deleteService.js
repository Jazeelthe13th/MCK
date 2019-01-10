import createKubeClient from './createKubeClient';

const deleteService = async () => {
    let client = await createKubeClient( 'TestEKSCluster' );
    let service = await client.api.v1.namespaces('default').services('test-service').delete();
    console.log( service );
};

deleteService();