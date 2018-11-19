

const transcoder = (event, context, callback) => {

    const polly = require('./Polly');
    const s3 = require('./S3');

    console.log(event);
    event.Records.forEach( record => {
        const description = record.dynamodb.NewImage.description.S;
        console.log(description);
        polly.convertTextToVoice(description)
            .then((audioStream) => {
                console.log(audioStream);
                return s3.saveFile(audioStream.AudioStream)
            })
            .then(() => console.log('saved',))
            .catch((e) => console.log('error',e));
    });

    callback(null, 'audio transcoder ok');

};

exports.transcoder = transcoder;

