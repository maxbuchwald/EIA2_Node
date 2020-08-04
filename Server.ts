import * as Http from "http";
// import * as Url from "url";
import * as Mongo from "mongodb";
import * as Url from "url";

export namespace Endabgabe {

    // let mongoClient: Mongo.MongoClient;
    let collection: Mongo.Collection;

    let port: number | string | undefined = process.env.PORT;
    if (port == undefined)
        port = 5001;

    let databaseUrl: string = "mongodb+srv://max:fxXOiSbuQv79F5en@cluster0-uamzt.mongodb.net/test";


    startServer(port);
    connectToDatabase(databaseUrl);

    async function startServer(_port: number | string): Promise<void> {
        let server: Http.Server = Http.createServer();
        console.log("Server starting on port:" + _port);

        server.listen(_port);
        server.addListener("request", handleRequest);
    }

    async function connectToDatabase(_url: string): Promise<void> {
        let options: Mongo.MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
        let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect();
        collection = mongoClient.db("zauberbild").collection("bilder");
        console.log("Database connection ", collection != undefined);
    }

    async function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): Promise<void> {
        _response.setHeader("content-type", "text/html; charset=utf-8");
        _response.setHeader("Access-Control-Allow-Origin", "*");


        if (_request.url) {
            // Unterscheidung von /save, /load und /read mit startsWith weil die url noch query parameter enthält
            if (_request.url.startsWith("/save")) {
                // save url query params
                let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true);
                storePicture(url.query);

            } else if (_request.url.startsWith("/load")) {

                // load picture from url name
                let url: Url.UrlWithParsedQuery = Url.parse(_request.url, true);
                let picture: any = await loadPicture(url.query.name);

                _response.write(JSON.stringify(picture));
            }
            
            else if (_request.url.startsWith("/read")) {
                let cursor: Mongo.Cursor<any> = await collection.find();
                let allNames: string[] = [];
                let storedElements: any[] = await cursor.toArray();
                for (let i: number = 0; i < storedElements.length; i++) {
                    let nameOfStoredElement: string = storedElements[i].name;
                    allNames.push(nameOfStoredElement);
                }
                _response.write(JSON.stringify(allNames));
            }
        }
        _response.end();
    }

    function storePicture(canvasData: any): void {
        // Update funktion erstellt einen neuen eintrag falls keiner mit den 'name' existiert. sonst updated sie den vorhandenen eintrag
        collection.update({name: canvasData.name}, canvasData, { upsert: true });
    }

    async function loadPicture(name: any): Promise<any> {
        // findOne gibt den ersten und nur einen eintrag zurück
        return await collection.findOne({
            name: name
        });
    }

}
