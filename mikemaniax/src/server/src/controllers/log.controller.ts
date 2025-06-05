import { RequestHandler } from "express";
import { User } from "../models/user";
import { Message } from "../models/chat";

export const showLog: RequestHandler = async (req, res) => {
    try {
        const {message} = req.body;
        console.log(message);

        res.json({message});
    } catch (error) {
        console.error(error);
        res.send("Server Error").status(500);
    }
}