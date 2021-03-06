const aws = require("@pulumi/aws");
const pulumi = require('@pulumi/pulumi');

const bucket = new aws.s3.Bucket("mchaaben-bucket-lab");

const article = new aws.dynamodb.Table("article",{
   attributes: [
       {name: "id", type: "S"}
          ],
    hashKey: "id",
    readCapacity:1,
    writeCapacity:1,
    streamEnabled:true,
    streamViewType:'NEW_IMAGE'
});

const rssReaderRole = new aws.iam.Role("rssReaderRole", {
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

new aws.iam.RolePolicy("rssReaderPolicy", {
    role: rssReaderRole,
    policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Action: [ "cloudwatch:*","dynamodb:*",        "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "logs:DescribeLogStreams"],
            Effect: "Allow",
            Resource: "*"
        }]
    })
});

const rssReader = new aws.lambda.Function("rssReader",{
    code: new pulumi.asset.AssetArchive({
        ".": new pulumi.asset.FileArchive(
            "rss-reader",
        ),
    }),
    role: rssReaderRole.arn,
    handler: "reader.handler",
    runtime: aws.lambda.NodeJS8d10Runtime,
    environment:{
        variables:{
            ARTICLE_TABLE: article.name
        }
    },
    timeout:30
});

const audioTrancoderRole = new aws.iam.Role("audioTrancoderRole", {
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

new aws.iam.RolePolicy("audioTranscoderPolicy", {
    role: audioTrancoderRole,
    policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Action: [ "polly:*","cloudwatch:*","s3:*","dynamodb:*","logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "logs:DescribeLogStreams" ],
            Effect: "Allow",
            Resource: "*"
        }]
    })
});

const audioTranscoder = new aws.lambda.Function("audioTranscoder",{
    code: new pulumi.asset.AssetArchive({
        ".": new pulumi.asset.FileArchive(
            "audio-transcoder",
        ),
    }),
    role: audioTrancoderRole.arn,
    handler: "transcoder.handler",
    runtime: aws.lambda.NodeJS8d10Runtime,
    timeout:30,
    environment:{
        variables:{
            BUCKET_NAME: bucket.bucket
        }
    },
});

const dynamoEvent = new aws.dynamodb.TableEventSubscription("transcoderTrigger",article,audioTranscoder,{batchSize:100,startingPosition:"LATEST"})

const rssReaderEventRule = new aws.cloudwatch.EventRule("event",{scheduleExpression:'rate(2400 minutes)'});

const rssEventSubscription = new aws.cloudwatch.EventRuleEventSubscription("event",rssReaderEventRule,rssReader);

exports.bucket = bucket;
exports.article = article;
exports.dynamoEvent = dynamoEvent;
exports.rssReader = rssReader;
exports.rssReaderEventRule = rssReaderEventRule;
exports.rssEventSubscription = rssEventSubscription;
exports.audioTranscoder = audioTranscoder;
