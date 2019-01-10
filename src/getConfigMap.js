import createKubeClient from './createKubeClient';

const getConfigMap = async () => {
    let client = await createKubeClient( 'TestEKSCluster' );
    let cm = await client.api.v1.namespaces ('kube-system').configmaps('aws-auth').get();
    console.log( cm );
};

getConfigMap();