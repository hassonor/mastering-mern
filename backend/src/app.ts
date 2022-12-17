import express, {Express} from "express";
import {HassonServer} from "./setupServer";
class Application {
    public initialize(): void{
        const app: Express = express();
        const server: HassonServer = new HassonServer(app);
        server.start();
    }
}

const application: Application = new Application();
application.initialize();