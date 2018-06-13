"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Http = require("http");
var Url = require("url");
var mongodb_1 = require("mongodb");
var Server;
(function (Server) {
    // root
    // pw: test1234
    var db;
    mongodb_1.MongoClient.connect("mongodb://admin:test1234@ds259410.mlab.com:59410/eia", function (err, _db) {
        if (err) {
            console.log(err);
        }
        else {
            db = _db.db('eia');
            console.log('success');
        }
    });
    // Homogenes assoziatives Array zur Speicherung einer Person unter der Matrikelnummer
    var port = process.env.PORT;
    if (port == undefined)
        port = 8100;
    var server = Http.createServer(function (_request, _response) {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
    });
    server.addListener("request", handleRequest);
    server.listen(port);
    function handleRequest(_request, _response) {
        console.log("Command received");
        var query = Url.parse(_request.url, true).query;
        console.log(query["command"]);
        if (query["command"]) {
            switch (query["command"]) {
                case "insert":
                    insert(query, _response);
                    break;
                case "refresh":
                    refresh(_response);
                    break;
                case "search":
                    search(query, _response);
                    break;
                default:
                    error();
                    _response.end();
            }
        }
    }
    function insert(query, _response) {
        var obj = JSON.parse(query["data"]);
        var studi = {
            surname: obj.name,
            name: obj.firstname,
            matrikel: parseInt(obj.matrikel.toString()),
            age: obj.age,
            gender: obj.gender,
            studiengang: obj.studiengang
        };
        db.collection("students").insertOne(studi, function (err, res) {
            if (err)
                throw err;
            _response.write("Dokument eingefügt");
            _response.end();
        });
    }
    function refresh(_response) {
        db.collection('students').find().toArray(function (err, result) {
            if (err)
                throw err;
            _response.write(JSON.stringify(result));
            _response.end();
        });
    }
    function search(query, _response) {
        db.collection('students').find({ matrikel: query.searchFor }).toArray(function (err, result) {
            if (err)
                throw err;
            _response.write(JSON.stringify(result));
            _response.end();
        });
    }
    function error() {
        alert("Error");
    }
})(Server || (Server = {}));
