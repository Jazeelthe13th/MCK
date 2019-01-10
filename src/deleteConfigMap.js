import createKubeClient from './createKubeClient';

const deleteConfigMap = async () => {
    let client = await createKubeClient( 'TestEKSCluster' );
    let cm = await client.api.v1.namespaces('kube-system').configmaps('aws-auth').delete();
    console.log( cm );
};

deleteConfigMap();