import AWS from 'aws-sdk';
import Promise from 'bluebird';
import fs from 'fs';
import setCredentials from './setCredentials_AWS';
import createKeyPair from './createEC2KeyPair';
import getClusterInfo from './describeCluster';
import createKubeClient from './createKubeClient';
import createConfigMap from './createConfigMap';

Promise.promisifyAll(fs);

setCredentials( /* Credentials here */  );
AWS.config.update( { region : 'us-east-1' } );

let clusterName = 'TestEKSCluster';

let cloudFormation = new AWS.CloudFormation( { apiVersion : '2010-05-15' } );

//Setup Worker Nodes with CFT
const createWorkerNodes = async () => {
    //Generate Key For SSH , Read Template Body
    let keyAndTemplate = await Promise.all( [ createKeyPair( 'TestEKSCluster-KeyPair' ) , fs.readFileAsync( 'amazon-eks-nodegroup.yaml' , 'utf-8' ).then( data => data).catch( err => console.log( err )) ] );
    
    //Save SSH Key
    let writeKey = fs.writeFileAsync( 'TestEKSCluster-KeyPair' , keyAndTemplate[0].KeyMaterial ).catch( err => console.log( err ) );

    //Get Cluster Info to plug into CFT
    let clusterInfo = await getClusterInfo( 'TestEKSCluster' );

    let params = {
        StackName : 'TestEKSCluster-worker-nodes',
        TemplateBody : keyAndTemplate[1] ,
        Capabilities : ['CAPABILITY_IAM'],
        Parameters : [
            {
                ParameterKey : 'ClusterName',
                ParameterValue : clusterInfo.cluster.name
            },
            {
                ParameterKey : 'ClusterControlPlaneSecurityGroup',
                ParameterValue : clusterInfo.cluster.resourcesVpcConfig.securityGroupIds.toString()
            },
            {
                ParameterKey : 'NodeGroupName',
                ParameterValue : 'TestEKS-NodeGroup'
            },
            {
                ParameterKey : 'NodeAutoScalingGroupMinSize',
                ParameterValue : '1'
            },
            {
                ParameterKey : 'NodeAutoScalingGroupMaxSize',
                ParameterValue : '3'
            },
            {
                ParameterKey : 'NodeImageId',
                ParameterValue : 'ami-0440e4f6b9713faf6'
            },
            {
                ParameterKey : 'KeyName',
                ParameterValue : keyAndTemplate[0].KeyName
            },
            {
                ParameterKey : 'VpcId',
                ParameterValue : clusterInfo.cluster.resourcesVpcConfig.vpcId
            },
            {
                ParameterKey : 'Subnets',
                ParameterValue : clusterInfo.cluster.resourcesVpcConfig.subnetIds.toString()
            }
        ]
    };

    //Create the Worker Nodes
    let workerNodeStack = await cloudFormation.createStack( params ).promise();

    //Wait for Completion of Creation
    let finalStatus = await cloudFormation.waitFor( 'stackCreateComplete' , { StackName : workerNodeStack.StackId } ).promise();

    //Create ConfigMap with RoleArn from stack
    let clientAndConfigMap = await Promise.all( [ createKubeClient( clusterInfo.cluster.name ) , createConfigMap( finalStatus.Stacks[0].Outputs[0].OutputValue ) ] );

    //Apply ConfigMap
    let applyConfig = await clientAndConfigMap[0].api.v1.namespaces('kube-system').configmaps.post( { body : clientAndConfigMap[1] } );
    console.log( applyConfig );
};

createWorkerNodes().catch( err => console.log( err ) );