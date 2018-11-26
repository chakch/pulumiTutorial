const AWS = require('aws-sdk');

const s3 ={};
const saveFile = (file) => {
    const S3 = new AWS.S3();
    let params = {
        Bucket : "serverless-xke-demo-file-saver",
        Key : "key.mp3",
        Body : file,
        ContentType:'audio/mp3'
    };
    return S3.upload(params).promise()
        .catch(e => console.log({e}));
};

s3.saveFile = saveFile;
module.exports = s3;
