"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Http = require("http");
const Url = require("url");
const Mongo = require("mongodb");
var Endabgabe;
(function (Endabgabe) {
    let scoreboard;
    let port = process.env.PORT;
    if (port == undefined) {
        port = 5001;
    }
    let databaseUrl = "mongodb+srv://max:endabgabe123@cluster0-uamzt.mongodb.net/test?retryWrites=true&w=majority";
    connectToDatabase(databaseUrl);
    startServer(port);
    function startServer(_port) {
        let server = Http.createServer();
        console.log("Server starting on port:" + _port);
        server.listen(_port);
        server.addListener("request", handleRequest);
    }
    async function connectToDatabase(_url) {
        let options = { useNewUrlParser: true, useUnifiedTopology: true };
        let mongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect();
        scoreboard = mongoClient.db("endabgabe").collection("scoreboard");
        console.log("Connected to database");
    }
    function handleRequest(_request, _response) {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        if (_request.url.startsWith("/store")) {
            storeData(_request, _response);
            return;
        }
        if (_request.url.startsWith("/get")) {
            getData(_request, _response);
            return;
        }
    }
    function storeData(_request, _response) {
        let url = Url.parse(_request.url, true);
        let query = url.query;
        if (query.name != null && query.score != null) {
            // Speicher in Datenbank
            let score = {
                name: query.name,
                points: parseInt(query.score),
            };
            console.log("store", score);
            storeScore(score);
        }
        _response.end();
    }
    function getData(_request, _response) {
        scoreboard.find({}, {
            limit: 10,
            sort: {
                points: -1
            }
        }).toArray((_err, docs) => {
            let jsonString = JSON.stringify(docs);
            _response.write(jsonString);
            _response.end();
        });
    }
    function storeScore(_score) {
        scoreboard.insert(_score);
    }
})(Endabgabe = exports.Endabgabe || (exports.Endabgabe = {}));
//# sourceMappingURL=Server.js.map