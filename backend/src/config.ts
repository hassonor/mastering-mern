import dotenv from 'dotenv';
import bunyan from 'bunyan';
import * as process from "process";

dotenv.config({});

class Config {
    public DATABASE_URI: string | undefined;
    public PORT: string | undefined;
    public JWT_TOKEN: string | undefined;
    public NODE_ENV: string | undefined;
    public SECRET_KEY_ONE: string | undefined;
    public SECRET_KEY_TWO: string | undefined;
    public CLIENT_URL: string | undefined;

    public REDIS_HOST: string | undefined;

    private readonly DEFAULT_DATABASE_URI = "mongodb://localhost:27017/hassonapp-backend"

    constructor() {
        this.DATABASE_URI = process.env.DATABASE_URI || this.DEFAULT_DATABASE_URI;
        this.PORT = process.env.PORT || "5000";
        this.JWT_TOKEN = process.env.JWT_TOKEN;
        this.NODE_ENV = process.env.NODE_ENV;
        this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE;
        this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO;
        this.CLIENT_URL = process.env.CLIENT_URL;
        this.REDIS_HOST = process.env.REDIS_HOST;
    }

    public createLogger(name: string): bunyan {
        return bunyan.createLogger({name, level: 'debug'});
    }

    public validateConfig(): void{
        for(const [key, value] of Object.entries(this)){
            if(value === undefined){
                throw new Error(`Configuration ${key} is undefined.`)
            }
        }
    }

};

export const config: Config = new Config();
