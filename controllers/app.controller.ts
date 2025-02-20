import { RequestHandler } from 'express';
import * as line from '@line/bot-sdk';
import { replyMessage } from '../utils/line';
import fs from 'fs';
import { Jimp } from 'jimp';
import axios from 'axios';

import dotenv from 'dotenv';
import { config } from '../utils/config';
import { Connect } from '../utils/mysql';
dotenv.config();

const host = process.env.HOST;
const qrCodeReader = require('qrcode-reader');
const client = new line.messagingApi.MessagingApiClient({
	channelAccessToken: config.channelAccessToken!,
});

export const callbackFn: RequestHandler = (req, res) => {
	try {
		const result = handleEvent(req.body.events);
		res.json(result);
	} catch (err) {
		console.error(err);
		res.status(500).end();
	}
};

async function handleEvent(events: line.webhook.Event[]) {
	const event = events[0];
	console.log(event);

	if (event.type === 'message') {
		if (event.message.type === 'text') {
			try {
				const text = event.message.text;
				if (text == 'จ่ายเงิน') {
					await replyMessage(config.channelAccessToken!, {
						replyToken: event.replyToken!,
						messages: [
							{
								type: 'image',
								originalContentUrl: `${host}/api/qr.jpg`,
								previewImageUrl: `${host}/api/qr.jpg`,
							},
						],
					});
				}
			} catch (error) {
				console.error(error);
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
						Authorization: `Bearer ${config.channelAccessToken}`,
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
					// console.log(value.result);
					fs.unlinkSync(path);
					return value.result;
				};
				qrCodeInstance.decode(image.bitmap);
				console.log(data);
				// await delay(100);
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
					console.log(slipData);

					await replyMessage(config.channelAccessToken!, {
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

						await replyMessage(config.channelAccessToken!, {
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
					console.log(err);
				}
			} catch (e) {
				console.error(e);
			}
		}
	} else if (event.type === 'follow') {
		const user = event.source;

		if (!user?.userId) return;

		const conn = await Connect();
		let sql = 'SELECT * FROM users WHERE user_id=?';
		let [results, fields] = await conn.execute(sql, [user.userId]);

		results = results as any[]

		if (results.length == 1) return;

		sql = 'INSERT INTO users(user_id) VALUE(?)';
		[results, fields] = await conn.execute(sql, [user.userId]);
		conn.end();
	}

	return;
}
