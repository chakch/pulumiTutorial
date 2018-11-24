const aws = require("@pulumi/aws");
const pulumi = require('@pulumi/pulumi');
const cloud = require("@pulumi/cloud");
const reader = require('./rss-reader/handler').hello;
const audioReader = require('./audio-transcoder/handler');

const tables = new aws.dynamodb.Table("article",{
   attributes: [
       {name: "id", type: "S"}
          ],
    hashKey: "id",
    readCapacity:1,
    writeCapacity:1,
    streamEnabled:true,
    streamViewType:'NEW_IMAGE'
});


const role = new aws.iam.Role("myrole", {
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Action: "sts:AssumeRole",
            Principal: {
                Service: "lambda.amazonaws.com"
            },
            Effect: "Allow",
            Sid: ""
        }]
    })
});

const rolePolicy = new aws.iam.RolePolicy("myrolepolicy", {
    role: role,
    policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Action: [ "polly:*","cloudwatch:*" ],
            Effect: "Allow",
            Resource: "*"
        }]
    })
});

const event = new cloud.timer.daily("reader",reader);

const test = new aws.lambda.Function("reader",{
    code: new pulumi.asset.AssetArchive({
        "file": new pulumi.asset.FileArchive(
            "rss-reader",
        ),
    }),
    role: role.arn,
    handler: "handler.hello",
    runtime: aws.lambda.NodeJS8d10Runtime,
});
//const test = new aws.dynamodb.TableEventSubscription("test",tables,audioReader,{batchSize:100,startingPosition:"LATEST"})

exports.tables = tables;
exports.event = event;
exports.test = test;
