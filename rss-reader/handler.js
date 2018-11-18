'use strict';



const hello = (event,context,callback) => {
    const reader = require('./RssReader');
    const article = require('./model/article');
    const getUuidByString = require('uuid-by-string');

    reader.read()
        .then((result) => {
            result.forEach(art => {
                //console.log('article',{...art, id: getUuidByString(art.title)});
                article.create({...art, id: getUuidByString(art.title)}, function (err, acc) {
                    console.log(err, acc);
                })
            });
        })
        .catch((e) => console.log(e));
    callback(null, 'feed read ok');
};

exports.hello = hello;
