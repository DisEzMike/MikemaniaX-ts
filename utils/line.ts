import { PushMessageRequest, ReplyMessageRequest } from "@line/bot-sdk/dist/messaging-api/api";
import axios from "axios";

export const replyMessage = async (CHANNEL_ACCESS_TOKEN: string, replyMessageRequest: ReplyMessageRequest) => {
    const URL = "https://api.line.me/v2/bot/message/reply"
    await axios.post(URL, replyMessageRequest, {
        headers : {
            Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
            "Content-Type": "application/json"
        }
    })
}

export const pushMessage = async (CHANNEL_ACCESS_TOKEN: string, pushMessageRequest: PushMessageRequest) => {
    const URL = "https://api.line.me/v2/bot/message/push"
    await axios.post(URL, pushMessageRequest, {
        headers : {
            Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
            "Content-Type": "application/json"
        }
    })
}