"use strict";
const Http = require("http");
const Url = require("url");
var L05_Server;
(function (L05_Server) {
    let port = process.env.PORT;
    if (port == undefined)
        port = 8100;
    let server = Http.createServer();
    server.addListener("listening", handleListen);
    server.addListener("request", handleRequest);
    server.listen(port);
    function handleListen() {
        console.log("Ich höre?");
    }
    function handleRequest(_request, _response) {
        console.log("Ich höre Stimmen!");
        let query = Url.parse(_request.url, true).query;
        let a = parseInt(query["a"]);
        let b = parseInt(query["b"]);
        for (let key in query)
            console.log(query[key]);
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.write("Ich habe dich gehört<br/>");
        _response.write("Das Ergebnis ist: " + (a + b));
        _response.end();
    }
})(L05_Server || (L05_Server = {}));
//# sourceMappingURL=Server.js.map