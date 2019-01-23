import AWS from 'aws-sdk';
import Promise from 'bluebird';
import fs from 'fs';
import setCredentials from './setCredentials_AWS';

//Promisifying fs to use in async/await
Promise.promisifyAll( fs );

setCredentials( /* Credentials here */  );
AWS.config.update( { region : 'us-east-1' } );

let cloudFormation = new AWS.CloudFormation( { apiVersion : '2010-05-15' } );

//Read CFT and wait for Stack Creation to be complete
const createVPCStack = async () => {
    let cft = await fs.readFileAsync('amazon-eks-vpc-sample.yaml' , 'utf-8');
    
    let params = {
        StackName : 'EKS-VPC',
        TemplateBody : cft 
    };

    let stack = await cloudFormation.createStack( params ).promise();
    
    return await cloudFormation.waitFor( 'stackCreateComplete' , { StackName : stack.StackId } ).promise();
};

export default createVPCStack;