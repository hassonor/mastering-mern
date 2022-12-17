import mongoose from "mongoose";
import * as process from "process";
import {config} from "./config";

export default () =>{
    const connect = () => {
        mongoose.set('strictQuery', true);
        mongoose.connect(`${config.DATABASE_URI}`).then(
            () => {
                console.log('Successfully connected to database.')
            })
            .catch((error) =>{
                console.log('Error when connecting to database',error);
                return process.exit(1);
            }
        )
    };
    connect();

    mongoose.connection.on('disconnected',connect);
};