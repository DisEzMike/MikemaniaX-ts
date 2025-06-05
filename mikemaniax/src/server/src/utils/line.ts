import { PushMessageRequest, ReplyMessageRequest } from "@line/bot-sdk/dist/messaging-api/api";
import axios, { AxiosError } from "axios";
import { LINE_CONFIG } from "./contant";

export const replyMessage = async (replyMessageRequest: ReplyMessageRequest) => {
    try {
        const URL = "https://api.line.me/v2/bot/message/reply"
        await axios.post(URL, replyMessageRequest, {
            headers : {
                Authorization: `Bearer ${LINE_CONFIG.channelAccessToken}`,
                "Content-Type": "application/json"
            }
        })   
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
            if ((error as AxiosError).status == 429) console.log(((error as AxiosError).response!.data as {message: string}).message);
            else {
                console.log("Retry in 10s...");
                setTimeout(() => replyMessage(replyMessageRequest), 10000);
            }
    }
}

export const pushMessage = async (pushMessageRequest: PushMessageRequest) => {
    try {
        const URL = "https://api.line.me/v2/bot/message/push"
        await axios.post(URL, pushMessageRequest, {
            headers : {
                Authorization: `Bearer ${LINE_CONFIG.channelAccessToken}`,
                "Content-Type": "application/json"
            }
        })
    } catch (error) {
            console.error(`Error: ${(error as Error).message}`);
            if ((error as AxiosError).status == 429) console.log(((error as AxiosError).response!.data as {message: string}).message);
            else {
                console.log("Retry in 10s...");
                setTimeout(() => pushMessage(pushMessageRequest), 10000);
            }
    }
}

export const getUserProfile = async (userId: string) => {
    try {
        const URL = `https://api.line.me/v2/bot/profile/${userId}`
        return await axios.get(URL, {
            headers: {
                Authorization: `Bearer ${LINE_CONFIG.channelAccessToken}`,
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
    }
}