import * as Http from "http"; //HTTP Modul wird eingebunden
import * as Url from "url"; //URL Modul wird eingebunden
namespace Server {
    interface AssocStringString {
        [key: string]: string;
    } //homogenes, assoziatives Array, Daten des Typs string werden dem key zugeordnet
      //Interface = Assoziatives Array mit key als SChl�ssel  
    
    let port: number = process.env.PORT; //Globale Variable - representiert den Systemumgebungs-Status der Applikation, wenn sie starte
    if (port == undefined) //wenn der Port "undefined" ist, dann soll port 8100 sein
        port = 8100;

    let server: Http.Server = Http.createServer(); //erzeugt Server-Objekt, mit dem weiter gearbeitet werden kann
    server.addListener("listening", handleListen); //wenn Programm l�uft - sprich auf etwas "geh�rt wird", dann Funktionsaufruf von handleListen
    server.addListener("request", handleRequest); //Server beibringen auf etwas zu h�ren
    server.listen(port);

    function handleListen(): void {
        console.log("Ich höre?");  //Konsolenausgabe bzw Terminalausgabe  
    }

    function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void { //handleRequest hat automatisch zwei Parameter, ohne R�ckgabewert
        console.log("Ich höre Stimmen!");
        // Ausgabe in der Konsole bzw. im Terminal
        // Server h�rt, wenn localhost:8100 im Browser ge�ffnet ist;
        // dann erscheint im Terminal "Ich h�re Stimmen"
        let query: AssocStringString = Url.parse(_request.url, true).query; //umwandeln von /?a=10&b=20 in ein JavaScript-Objekt
        let a: number = parseInt(query["a"]); //a wird als Variable definiert
        let b: number = parseInt(query["b"]); //b wird als Variable definiert
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
}