import * as dotenv from 'dotenv'
import express, { Application, ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { Server } from "http";
import createHttpError from "http-errors";
import { Connection, Mongoose } from "mongoose";
dotenv.config();

const app: Application = express();
const mongoose: Mongoose = new Mongoose();

mongoose.connect(process.env.DATABASE_URL ?? '');
const db: Connection = mongoose.connection;
db.on('error', (err)=> console.error(err));
db.once('open', ()=> console.log("Database connected"));

app.use(express.json());

app.get("/", (req, res, next)=>{
    res.send("Ok babe, we got it")
});


//404
app.use((req: Request, res: Response, next: NextFunction)=>{
    next(new createHttpError.NotFound());
});

//Errors
const errorHandler: ErrorRequestHandler = (err, req, res, next) =>{
    res.status(err.status || 500);
    res.send({
        status: err.status,
        message: err.message
    })
}
app.use(errorHandler);

const server: Server = app.listen(4000, ()=> console.log("Server is running"));