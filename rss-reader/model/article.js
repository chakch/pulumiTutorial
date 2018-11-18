const Joi = require('joi');
const dynogels = require('dynogels');
dynogels.AWS.config.update({region: "eu-central-1"});

const Article = dynogels.define('article', {
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
});


module.exports = Article;
