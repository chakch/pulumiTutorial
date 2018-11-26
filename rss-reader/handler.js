const getUuidByString = require('uuid-by-string');
const AWS = require('aws-sdk');
const rssReader = require('./RssReader');
const articleTable = process.env.ARTICLE_TABLE;
const hello = () => {

    return rssReader.read()
        .then((result) => {
            return result.map(art => {
                if(art){
                    console.log({art})
                    const d = new AWS.DynamoDB();
                    var params = {
                        Item: {
                            "id": {
                                S: getUuidByString(art.title)
                            },
                            "title": {
                                S: art.title
                            },
                            "description": {
                                S: art.description
                            }
                        },
                        ReturnConsumedCapacity: "TOTAL",
                        TableName: articleTable
                    };
                    return d.putItem(params).promise().catch((e) => console.log({e}))
                    //return Article.create({...art, id: getUuidByString(art.title)});
                }
            });
        })
        .catch((e) => console.log(e));
};
exports.hello = hello
