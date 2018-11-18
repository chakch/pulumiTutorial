const aws = require("@pulumi/aws");
const cloud = require("@pulumi/cloud");
const reader = require('./rss-reader/handler').hello;


const tables = new aws.dynamodb.Table("table",{
   attributes: [
       {name: "id", type: "S"}
          ],
    hashKey: "id",
    readCapacity:1,
    writeCapacity:1
});
// Export the public URL for the HTTP service
//exports.url = endpoint.url;

const Event = new cloud.timer.daily("reader",reader);

exports.tables = tables;
exports.Event = Event;


// Create a public HTTP endpoint (using AWS APIGateway)
/*const endpoint = new aws.apigateway.x.API("hello", {
    routes: [
        // Serve a simple REST API on `GET /name` (using AWS Lambda)
        {
            path: "/source",
            method: "GET",
            eventHandler: (req, ctx, cb) => {
                cb(undefined, {
                    statusCode: 200,
                    body: Buffer.from(JSON.stringify({ name: "AWS" }), "utf8").toString("base64"),
                    isBase64Encoded: true,
                    headers: { "content-type": "application/json" },
                })
            }
        }
    ]
});*/
