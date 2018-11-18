const AWS = require('aws-sdk');
//const Stream = require('stream')
//const Fs = require('fs');


const convertTextToVoice = function(data){
    const polly = new AWS.Polly();
    console.log('data',data);
    const params = {
        OutputFormat: "mp3",
        SampleRate: "8000",
        Text: "data",
        TextType: "text",
        VoiceId: 'Celine'
    };
    return polly.synthesizeSpeech(params).promise();

};


exports.convertTextToVoice = convertTextToVoice;
