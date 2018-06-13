import * as Http from "http";
import * as Url from "url";
import {MongoClient, Db} from "mongodb";

namespace Server {
    
    // root
    // pw: test1234
    
    let db;
    MongoClient.connect("mongodb://admin:test1234@ds259410.mlab.com:59410/eia", function (err, _db) {
        if (err) {
            console.log(err);
        } else {
            db = _db.db('eia');
            console.log('success');
        }
    });
    
    interface AssocStringString {
        [key: string]: string;
    }
    
    interface Studi {
        surname: string;
        name: string;
        matrikel: number;
        age: number;
        gender: boolean;
        studiengang: string;
    }
    
    // Struktur des homogenen assoziativen Arrays, bei dem ein Datensatz der Matrikelnummer zugeordnet ist
    interface Studis {
        [matrikel: string]: Studi;
    }
    
    // Homogenes assoziatives Array zur Speicherung einer Person unter der Matrikelnummer
    let port: number = process.env.PORT;
    if (port == undefined)
        port = 8100;
    
    let server: Http.Server = Http.createServer((_request: Http.IncomingMessage, _response: Http.ServerResponse) => {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");
    });
    server.addListener("request", handleRequest);
    server.listen(port);
    
    function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
        console.log("Command received");
        let query: AssocStringString = Url.parse(_request.url, true).query;
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
    
    function insert(query: AssocStringString, _response: Http.ServerResponse): void {
        let obj = JSON.parse(query["data"]);
        
        let studi: Studi = {
            surname: obj.name,
            name: obj.firstname,
            matrikel: parseInt(obj.matrikel.toString()),
            age: obj.age,
            gender: obj.gender,
            studiengang: obj.studiengang
        };
        
        db.collection("students").insertOne(studi, function (err, res) {
            if (err) throw err;
            _response.write("Dokument eingefügt");
            _response.end();
        });
    }
    
    function refresh(_response: Http.ServerResponse): void {
        db.collection('students').find().toArray(function (err, result) {
            if (err) throw err;
            
            _response.write(JSON.stringify(result));
            _response.end();
        });
    }
    
    function search(query: AssocStringString, _response: Http.ServerResponse): void {
        db.collection('students').find({matrikel: query.searchFor}).toArray(function (err, result) {
            if (err) throw err;
            
            _response.write(JSON.stringify(result));
            _response.end();
        });
    }
    
    function error(): void {
        alert("Error");
    }
}