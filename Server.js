"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Http = require("http");
// import * as Url from "url";
const Mongo = require("mongodb");
const Url = require("url");
var Endabgabe;
(function (Endabgabe) {
    // let mongoClient: Mongo.MongoClient;
    let collection;
    let port = process.env.PORT;
    if (port == undefined)
        port = 5001;
    let databaseUrl = "mongodb+srv://max:fxXOiSbuQv79F5en@cluster0-uamzt.mongodb.net/test";
    startServer(port);
    connectToDatabase(databaseUrl);
    async function startServer(_port) {
        let server = Http.createServer();
        console.log("Server starting on port:" + _port);
        server.listen(_port);
        server.addListener("request", handleRequest);
    }
    async function connectToDatabase(_url) {
        // options noch nicht klar
        let options = { useNewUrlParser: true, useUnifiedTopology: true };
        let mongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect();
        collection = mongoClient.db("zauberbild").collection("bilder");
        console.log("Database connection ", collection != undefined);
    }
    async function handleRequest(_request, _response) {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        if (_request.url) {
            // Unterscheidung von /save, /load und /read mit startsWith weil die url noch query parameter enthält
            if (_request.url.startsWith("/save")) {
                // save url query params
                let url = Url.parse(_request.url, true);
                storePicture(url.query);
            }
            else if (_request.url.startsWith("/load")) {
                // load picture from url name
                let url = Url.parse(_request.url, true);
                let picture = await loadPicture(url.query.name);
                _response.write(JSON.stringify(picture));
            }
            else if (_request.url.startsWith("/read")) {
                let cursor = await collection.find();
                let allNames = [];
                let storedElements = await cursor.toArray();
                for (let i = 0; i < storedElements.length; i++) {
                    let nameOfStoredElement = storedElements[i].name;
                    allNames.push(nameOfStoredElement);
                }
                _response.write(JSON.stringify(allNames));
            }
        }
        _response.end();
    }
    function storePicture(canvasData) {
        // Update funktion erstellt einen neuen eintrag falls keiner mit den 'name' existiert. sonst updated sie den vorhandenen eintrag
        collection.update({ name: canvasData.name }, canvasData, { upsert: true });
    }
    async function loadPicture(name) {
        // findOne gibt den ersten und nur einen eintrag zurück
        return await collection.findOne({
            name: name
        });
    }
})(Endabgabe = exports.Endabgabe || (exports.Endabgabe = {}));
//# sourceMappingURL=Server.js.map