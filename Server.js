"use strict";
const Http = require("http"); //HTTP Modul wird eingebunden
const Url = require("url"); //URL Modul wird eingebunden
var Server;
(function (Server) {
    //Interface = Assoziatives Array mit key als SChl�ssel  
    let port = process.env.PORT; //Globale Variable - representiert den Systemumgebungs-Status der Applikation, wenn sie starte
    if (port == undefined)
        port = 8100;
    let server = Http.createServer(); //erzeugt Server-Objekt, mit dem weiter gearbeitet werden kann
    server.addListener("listening", handleListen); //wenn Programm l�uft - sprich auf etwas "geh�rt wird", dann Funktionsaufruf von handleListen
    server.addListener("request", handleRequest); //Server beibringen auf etwas zu h�ren
    server.listen(port);
    function handleListen() {
        console.log("Ich höre?"); //Konsolenausgabe bzw Terminalausgabe  
    }
    function handleRequest(_request, _response) {
        console.log("Ich höre Stimmen!");
        // Ausgabe in der Konsole bzw. im Terminal
        // Server h�rt, wenn localhost:8100 im Browser ge�ffnet ist;
        // dann erscheint im Terminal "Ich h�re Stimmen"
        let query = Url.parse(_request.url, true).query; //umwandeln von /?a=10&b=20 in ein JavaScript-Objekt
        let a = parseInt(query["a"]); //a wird als Variable definiert
        let b = parseInt(query["b"]); //b wird als Variable definiert
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
        _response.write("Ich habe dich gehört<br/>");
        for (let key in query)
            //console.log(query[key]);
            _response.write("Eingegebene Query-Information lautet: " + (query[key]) + "<br>");
        _response.write("Das Ergebnis ist: " + (a + b));
        //L�sung erscheint im Browserfenster mit "Das Ergebnis ist:"
        _response.end();
    }
})(Server || (Server = {}));
//# sourceMappingURL=Server.js.map