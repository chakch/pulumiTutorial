const polly = require('./Polly');
const s3 = require('./S3');


const transcoder = (event, context, callback) => {

    console.log(event);
    const res = event.Records.map( record => {
        const description = record.dynamodb.NewImage.description.S;
        console.log(description);
        return polly.convertTextToVoice(description)
            .then((audioStream) => {
                console.log(audioStream);
                return s3.saveFile(audioStream.AudioStream)
            })
            .then(() => console.log('saved',))
            .catch((e) => console.log('error',e));
    });
    Promise.all(res);
    callback(null, 'audio transcoder ok');
};

exports.transcoder = transcoder;

