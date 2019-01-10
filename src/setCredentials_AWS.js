const setCredentials = ( accessKey , secretKey ) => {
    process.env.AWS_ACCESS_KEY_ID = accessKey;
    process.env.AWS_SECRET_ACCESS_KEY = secretKey;
}

export default setCredentials;
