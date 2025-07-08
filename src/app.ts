import express from "express";
import { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to NK Tour Management System Server!"
    })
});


export default app;
