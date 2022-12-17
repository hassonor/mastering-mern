import mongoose from "mongoose";
import * as process from "process";

export default () =>{
    const connect = () => {
        mongoose.set('strictQuery', true);
        mongoose.connect(process.env.URI_MONGO as string).then(
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