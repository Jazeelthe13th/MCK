import createKubeClient from './createKubeClient';
import readYaml from 'read-yaml-promise';

const createService = async () => {
    let clientAndServiceConfig  = await Promise.all( [ createKubeClient( 'TestEKSCluster' ) , readYaml( 'test-service.yaml' ).then( data => data ) ] );
    let service = await clientAndServiceConfig[0].api.v1.namespaces('default').services.post( { body : clientAndServiceConfig[1] } );
    console.log( service );
};

createService();