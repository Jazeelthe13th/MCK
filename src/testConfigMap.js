import createKubeClient from './createKubeClient';
import createConfigMap from './createConfigMap';
import fs from 'fs';
import Promise from 'bluebird';
import config from './config.json';

Promise.promisifyAll( fs );

const testKubeClient = async () => {
    let client = await createKubeClient( 'TestEKSCluster' );
    //let configMap = await createConfigMap( 'arn:aws:iam::786796469737:role/TestEKSCluster-worker-nodes-NodeInstanceRole-1XG7ZTWKCNFV5' )
    //let config = await fs.writeFileAsync( 'config.json' , JSON.stringify( configMap , null , 4 ) ).catch( err => console.log( err ) );
    let ns = await client.api.v1.namespaces('kube-system').configmaps.post( { body : config } );
    //console.log( ns.body.items[0] );
    console.log( ns );
};

testKubeClient();