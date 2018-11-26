const AWS = require('aws-sdk');

const saveFile = (id,file) => {
    const S3 = new AWS.S3();
    let params = {
        Bucket : "serverless-xke-demo-file-saver",
        Key : `${id}.mp3`,
        Body : file,
        ContentType:'audio/mp3'
    };
    return S3.upload(params).promise()
        .catch(e => console.log({e}));
};

exports.saveFile = saveFile;
