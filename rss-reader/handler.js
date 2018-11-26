const feedparser = require('feedparser-promised');
const AWS_FEED = 'https://aws.amazon.com/en/new/feed/';
const entities = require('html-entities').AllHtmlEntities;
const striptags = require('striptags');
const getUuidByString = require('uuid-by-string');
const Joi = require('joi');
const dynogels = require('dynogels');
const AWS = require('aws-sdk');
const rssReader = require('./RssReader');
/*dynogels.AWS.config.update({region: "eu-central-1"});

let Article = dynogels.define('article', {
    hashKey: 'id',
    timestamps: true,
    schema: {
        id: Joi.string(),
        description: Joi.string(),
        title: Joi.string(),
        link: Joi.string(),
        date: Joi.date()
    },
    tableName: 'article'
});*/

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
                        TableName: "article-3930df2"
                    };
                    return d.putItem(params).promise().catch((e) => console.log({e}))
                    //return Article.create({...art, id: getUuidByString(art.title)});
                }
            });
        })
        .catch((e) => console.log(e));
};
exports.hello = hello
