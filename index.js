const aws = require("@pulumi/aws");
const cloud = require("@pulumi/cloud");
const reader = require('./rss-reader/handler').hello;
const audioReader = require('./audio-transcoder/handler').transcoder;

const tables = new aws.dynamodb.Table("table",{
   attributes: [
       {name: "id", type: "S"}
          ],
    hashKey: "id",
    readCapacity:1,
    writeCapacity:1,
    streamEnabled:true,
    streamViewType:'NEW_IMAGE'
});

const Event = new cloud.timer.daily("reader",reader);
const test = new aws.dynamodb.TableEventSubscription("test",tables,audioReader,{batchSize:100,startingPosition:"LATEST"})

exports.tables = tables;
exports.Event = Event;
exports.test = test;
