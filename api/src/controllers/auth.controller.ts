import { Request, RequestHandler, Response } from "express";
import { User } from "../models/user";
import jwt from "jsonwebtoken";
import { CustomRequst } from "../config/interface";

export const login: RequestHandler = async (req, res) => {
    try {
        let user = await User.findOneAndUpdate({userId: req.body.userId}, {new: true});

        if (!user) {
            user = new User(req.body);
            await user.save()
        }

        let payload = {
            user
        }

        jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: "1d"}, (error, token) => {
            if (error) throw error;
            res.json({payload, token});
            
        });
    } catch (error) {
        res.json({status: 500, message: "error"})
    }
}

export const currentUser:any = async (req: CustomRequst, res: Response) => {
  try {
    //code
    let user = req.user;
    user = await User.findOne({ name: user.displayName })
      .select("-password")
      .exec();

    res.send(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};