// import mysql from 'mysql2/promise';
import { Request, RequestHandler, Response } from 'express';
import * as line from '@line/bot-sdk';
import { getUserProfile, pushMessage, replyMessage } from '../utils/line';
import fs from 'fs';
import { Jimp } from 'jimp';
import axios from 'axios';

import dotenv from 'dotenv';
import { LINE_CONFIG } from '../utils/contant';
import { User } from '../models/user';
import { DefaultEventsMap, Server, Socket } from 'socket.io';
import { Message } from '../models/chat';
import { io } from '../../server';
// import { config } from '../utils/config';
// import { params } from '../utils/mysql';
dotenv.config();

const host = process.env.HOST;
const qrCodeReader = require('qrcode-reader');
const client = new line.messagingApi.MessagingApiClient({
	channelAccessToken: LINE_CONFIG.channelAccessToken!,
});

export const callbackFn:RequestHandler = async (req, res) => {
	try {
		await handleEvent(req.body.events);
		res.send(200);
	} catch (err) {
		console.error(err);
		res.status(500).end();
	}
};

async function handleEvent(events: line.webhook.Event[]) {
	const event = events[0];

	if (event.type === 'message') {
		if (event.message.type === 'text') {
			const cmd = event.message.text.split(" ");

			if (cmd[0] == 'จ่ายเงิน') {
				await replyMessage({
					replyToken: event.replyToken!,
					messages: [
						{
							type: 'image',
							originalContentUrl: `${host}/qr.jpg`,
							previewImageUrl: `${host}/qr.jpg`,
						},
					],
				});
			} 
			else {
				try {
					const user = await User.findOneAndUpdate({userId: event.source!.userId}, {new: true});

					if (!user) return;

					const msgData = {
						room: user.userId,
						userId: user.userId,
						message: cmd.join(" ")
					}
					const msg = new Message(msgData);
					await msg.save();
					io.to(msg.room!).emit("chat message", msg);
				} catch (error) {
					console.error(`Error : ${(error as Error).message}`);
				}
			}
		}

		if (event.message.type === 'image') {
			try {
				let url = `https://api-data.line.me/v2/bot/message/${event.message.id}/content`;
				const path = __dirname + '/../temp/temp.jpg';
				let writer = fs.createWriteStream(path);
				const delay = (ms: number) =>
					new Promise((resolve) => setTimeout(resolve, ms));
				const resp = await axios.get(url, {
					responseType: 'stream',
					headers: {
						Authorization: `Bearer ${LINE_CONFIG.channelAccessToken}`,
					},
				});
				await resp.data.pipe(writer);
				await delay(2500);
				const buffer = fs.readFileSync(path);
				const image = await Jimp.read(buffer);
				const qrCodeInstance = new qrCodeReader();
				var data = '';
				qrCodeInstance.callback = function (err: any, value: any) {
					if (err) {
						console.error(err);
					}
					// __ Printing the decrypted value __ \\
					data = value.result;
					fs.unlinkSync(path);
					return value.result;
				};
				qrCodeInstance.decode(image.bitmap);
				try {
					const url = process.env.API_URL!;
					const apiKey = process.env.API_KEY!;
					const res = await axios.post(
						url,
						{
							data,
							log: true,
						},
						{
							headers: {
								'x-authorization': apiKey,
							},
						}
					);
					// Handle success slip
					const slipData = res.data.data;

					await replyMessage({
						replyToken: event.replyToken!,
						messages: [
							{
								type: 'text',
								text: 'ชำระเงินเสร็จสิ้น ✅',
							},
						],
					});
				} catch (err) {
					// Handle invalid slip
					if (axios.isAxiosError(err)) {
						const errorData = (err as any).response.data;

						await replyMessage({
							replyToken: event.replyToken!,
							messages: [
								{
									type: 'text',
									text: errorData.message,
								},
							],
						});

						return;
					}
				}
			} catch (error) {
				console.error(`Error : ${(error as Error).message}`);
			}
		}
	} else if (event.type === 'follow') {
		const user = event.source;

		if (!user?.userId) return;

		try {
			const res = await getUserProfile(user.userId);
			const data = {
				userId: res?.data.userId,
				displayName: res?.data.displayName,
				pictureUrl: res?.data.pictureUrl,
				statusMessage: res?.data.statusMessage
			}

			let profile = await User.findOneAndUpdate({userId: user.userId}, {new: true});

			if (!profile) {
				profile = new User(data);
				profile.save();
			}
		} catch (error) {
			console.error(`Error : ${(error as Error).message}`);
		}
	} else if (event.type === 'unfollow') {
		const user = event.source;

		if (!user?.userId) return;

		try {
			let profile = await User.findOneAndUpdate({userId: user.userId}, {new: true});

			if (!profile) return;
			if (profile.role === 'admin') return;

			await User.findByIdAndDelete(profile.id);
		} catch (error) {
			console.error(`Error : ${(error as Error).message}`);
		}
	}
	return;
}
