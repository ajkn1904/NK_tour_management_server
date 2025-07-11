import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import { UserRoutes } from "./app/modules/user/user.route";

const app = express();

app.use(express.json());
app.use(cors());


app.use("/api/v1/user", UserRoutes);


app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to NK Tour Management System Server!"
    })
});


export default app;
