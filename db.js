var https = require('https');
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;

var DbUrl = "mongodb://localhost:27017/myproject";
var url = 'https://api.cryptowat.ch/markets/prices';

var counter = 0;

var loop = setInterval(() => {
  counter++;
  insertToDb();
  console.log(counter);

  if (counter > 1000) {
    clearInterval(loop);
  }
}, 3000);

function insertToDb() {
  MongoClient.connect(DbUrl, function(err, db) {

    assert.equal(null, err);
    console.log("Database initialized");
    insertDocuments(db, function() {
      db.close();
    });
  });

}

var getData = function(callback) {

  var r = '';

  https.get(url, function(result) {
    result.on('data', (chunk) => {
      r += chunk;
    });

    result.on('end', () => {
      callback(r);
    });
  });
};

var insertDocuments = function(db, callback) {

  var collection = db.collection('documents');

  getData(function(data) {

    data = JSON.parse(data);

    data.t = (new Date()).getTime();
    console.log(data.allowance.remaining);
    collection.insertMany([data], function(err, result) {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      assert.equal(1, result.ops.length);
      callback();
    });
  });
};

module.exports = {
  insertDocuments
};
