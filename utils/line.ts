import * as line from '@line/bot-sdk';
import { ReplyMessageRequest } from "@line/bot-sdk/dist/messaging-api/api";
import axios from "axios";

import dotenv from 'dotenv';
dotenv.config();

export const replyMessage = async (CHANNEL_ACCESS_TOKEN: string, replyMessageRequest: ReplyMessageRequest) => {
    const URL = "https://api.line.me/v2/bot/message/reply"
    await axios.post(URL, replyMessageRequest, {
        headers : {
            Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
            "Content-Type": "application/json"
        }
    })
}

export const config: line.MiddlewareConfig = {
	channelSecret: process.env.LINE_CHANNEL_SECRET!,
	channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
};