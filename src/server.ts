/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-require-imports */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
require("dotenv").config();

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

//unhandledRejection error handler
process.on("unhandledRejection", (error) => {
  console.log(
    "Unhandled Rejection Error Detected. Server is Shutting down...",
    error
  );

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

//example:
//Promise.reject(new Error("Forgot to handle this promise!"));

//unhandledException error handler
process.on("uncaughtException", (error) => {
  console.log(
    "Uncaught Exception Error Detected. Server is Shutting down...",
    error
  );
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//example:
//throw new Error("Forgot to handle this Local error!");



//SIGTERM signal handler
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received. Server is shutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//SIGINT signal handler
process.on("SIGINT", () => { 
  console.log("SIGINT signal received. Server is shutting down...");
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
}); 
