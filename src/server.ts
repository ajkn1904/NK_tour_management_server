
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
require('dotenv').config();

let server: Server;


const PORT = 5000;


const startServer = async () => {
  try {
    await mongoose.connect(`${process.env.DATABASE_URL}`);
    console.log("connected to MongoDB using mongoose.");

    server = app.listen(PORT, () => {
      console.log(`NK Tour Management Server is listening to port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
