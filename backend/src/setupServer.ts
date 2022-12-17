import {Application, json, urlencoded, Response, Request, NextFunction} from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import compression from 'compression';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import "express-async-errors";
import * as process from "process";
import {config} from './config';

const PORT = 5000 || process.env.PORT


export class HassonServer {
    private  app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public start(): void{
        this.securityMiddleware(this.app);
        this.standardMiddleware(this.app);
        this.routeMiddleware(this.app);
        this.globalErrorHandler(this.app);
        this.startServer(this.app);
    }

    private securityMiddleware(app: Application): void{
        app.use(cookieSession({
            name: 'session',
            keys: [config.SECRET_KEY_ONE!, config.SECRET_KEY_ONE!],
            maxAge: 24 * 7 * 3600000,
            secure: config.NODE_ENV !== 'development'
        }))
        app.use(hpp());
        app.use(helmet());
        app.use(cors({
            origin: config.CLIENT_URL,
            credentials: true,
            optionsSuccessStatus: 200,
            methods: ['GET','POST','PUT','DELETE','OPTIONS']
        }))
    }
    private standardMiddleware(app: Application): void{
        app.use(compression());
        app.use(json({limit: '50mb'}));
        app.use(urlencoded({extended: true, limit: '50mb'}));
    }
    private routeMiddleware(app: Application): void{}
    private globalErrorHandler(app: Application): void{}
    private async startServer(app: Application): Promise<void>{
        try{
            const httpServer: http.Server = new http.Server(app);
            this.startHttpServer(httpServer);
        }
        catch(error){
            console.log(error)
        }
    }
    private createSocketIO(httpServer: http.Server): void{}
    private startHttpServer(httpServer: http.Server): void{
        httpServer.listen(PORT, ()=> console.log(`Server is running on port: ${PORT}`));
    }
}