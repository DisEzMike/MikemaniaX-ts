import { PushMessageRequest, ReplyMessageRequest } from "@line/bot-sdk/dist/messaging-api/api";
import axios, { AxiosError } from "axios";

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
    try {
        const URL = "https://api.line.me/v2/bot/message/push"
        await axios.post(URL, pushMessageRequest, {
            headers : {
                Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
                "Content-Type": "application/json"
            }
        })
    } catch (error) {
            console.error(`Error: ${(error as Error).message}`);
            if ((error as AxiosError).status == 429) console.log(((error as AxiosError).response!.data as {message: string}).message);
            else {
                console.log("Retry in 10s...");
                setTimeout(() => pushMessage(CHANNEL_ACCESS_TOKEN, pushMessageRequest), 10000);
            }
    }
}