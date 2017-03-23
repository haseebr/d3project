var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;

var DbUrl = "mongodb://localhost:27017/myproject";

function connectAndGetData(gt, lt, e, callback) {
  MongoClient.connect(DbUrl, function(err, db) {

    assert.equal(null, err);
    console.log("Database initialized");
    getDataRange(lt, gt, e, db, function(items) {
      callback(items);
      db.close();
    });
  });

}

//connectAndGetData(1490080284931, 1490080275908, (items) => {});

var getDataRange = function(gt, lt, e, db, callback) {

  var result = db.collection('documents', (err, collection) => {
    collection.find({
      t: {
        $gt: gt,
        $lt: lt
      }
    }).toArray((err, items) => {
      var values = [];
      for (var i in items) {
        values.push([items[i].t, items[i].result[e]]);
      }
      console.log("imside ret", gt, lt, e, values);
      callback(values);
    });
  });

};

module.exports = {
  connectAndGetData,
  getDataRange
};
