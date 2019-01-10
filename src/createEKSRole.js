import setCredentials from './setCredentials_AWS';
import AWS from 'aws-sdk';
import uuidv1 from 'uuid/v1';

//Setting Credentials and Region
setCredentials( 'AKIA3OMFZLXUVA6TU3OJ' , 'w19JaY5StCPMcsSHa4BkilGxB62MFPOVugUYXnKD' );
AWS.config.update( { region : 'us-east-1' } );

//Locking IAM API Version
let iam = new AWS.IAM( { apiVersion : '2010-05-08' } );

//Role Trust Policy Document
let rolePolicyDocument = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "eks.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
};

let roleParams = {
    AssumeRolePolicyDocument : JSON.stringify( rolePolicyDocument ),
    RoleName : "EKSServiceRole" + uuidv1() ,
    Description : "Allows EKS to manage clusters on your behalf."
};

//Creating Role and Attaching Policies
const createEKSRole = async ( ) => {
    let role = await iam.createRole( roleParams ).promise( );
    let attachPolicies = await Promise.all( [iam.attachRolePolicy( { PolicyArn : "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy" , RoleName : roleParams.RoleName } ).promise( ) , iam.attachRolePolicy( { PolicyArn : "arn:aws:iam::aws:policy/AmazonEKSServicePolicy" , RoleName : roleParams.RoleName } ).promise( )] );
    return role;
}

export default createEKSRole;