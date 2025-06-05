import { RequestHandler } from "express";
import { User } from "../models/user";
import { Message } from "../models/chat";

export const getUser: RequestHandler = async (req, res) => {
    try {
        const {userId} = req.params;
        const data = await User.find({userId});

        res.json(data[0]);
    } catch (error) {
        console.error(error);
        res.send("Server Error").status(500);
    }
}

export const getAllUser: RequestHandler = async (req, res) => {
    try {
        let data = await User.find({})
        res.json(data)
    } catch (error) {
        console.error(error);
        res.send("Server Error").status(500);
    }
}