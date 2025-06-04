import { User } from './../models/user';
import { Request, RequestHandler } from "express";

export interface CustomRequst extends Request {
  user: any // or any other type
}