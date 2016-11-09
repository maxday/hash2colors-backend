var express     = require("express");

var port = process.env.PORT || 8080;
var mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/hash2colors";

var app = express();

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "1mb"}));

app.get('/', function(request, response) {
  response.send({success : true});
});

app.get('/hash/add/:hashString?', function(request, response) {
  var hashString = request.params.hashString;
  console.log(hashString);
  MongoClient.connect(mongoURI, function(err, db) {
    if(err !== null) {
      console.log(err);
      response.send({success : false});
      return;
    }
    console.log("Connected to server");
    var collection = db.collection('hash');
    collection.insert(
      { hash : hashString},
      function(err, result) {
        if(err === null) {
          response.send({success : true, hash : hashString});
        }
        else {
          console.log(err);
          response.send({success : false});
        }
    });
  });
});


app.get('/hash/list', function(request, response) {
  MongoClient.connect(mongoURI, function(err, db) {
    if(err !== null) {
      response.send({success : false});
      return;
    }
    console.log("Connected to server");
    var collection = db.collection('hash');
    collection.find({}).toArray(
      function(err, result) {
        if(err ===null) {
          console.log(result);
          response.send(result);
        }
        else {
          response.send({success : false});
        }
    });
  });
});


app.listen(port);
