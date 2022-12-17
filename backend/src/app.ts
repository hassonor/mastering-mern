import * as dotenv from "dotenv";
import express, {Express} from "express";
import {HassonServer} from "./setupServer";
import dbConnection from './setupDatabase';

dotenv.config();
class Application {
    public initialize(): void{
        dbConnection()
        const app: Express = express();
        const server: HassonServer = new HassonServer(app);
        server.start();
    }
}

const application: Application = new Application();
application.initialize();