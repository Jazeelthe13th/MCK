import createKubeClient from './createKubeClient';

const getService = async () => {
    let client = await createKubeClient( 'TestEKSCluster' );
    let service = await client.api.v1.namespaces('default').services('test-service').get();
    console.log( service );
    console.log( service.body.status.loadBalancer.ingress );
};

getService();