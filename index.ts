import * as line from '@line/bot-sdk';
import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import { Jimp } from 'jimp';
const qrCodeReader = require('qrcode-reader');
import axios from 'axios';
import { replyMessage } from './utils/line';

dotenv.config();

const host = process.env.HOST;

// create LINE SDK config from env variables
const config: line.MiddlewareConfig = {
	channelSecret: process.env.LINE_CHANNEL_SECRET!,
	channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
};

// create LINE SDK client
const client = new line.messagingApi.MessagingApiClient({
	channelAccessToken: config.channelAccessToken!,
});

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

app.get('/', (req, res) => {
	res.json({ text: 'Hello, world!' });
});

app.use('/api', express.static('public'));

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), async (req, res) => {
	try {
		const result = handleEvent(req.body.events);
		res.json(result);
	} catch (err) {
		console.error(err);
		res.status(500).end();
	}
});

// event handler
async function handleEvent(
	events: line.webhook.Event[]
): Promise<line.MessageAPIResponseBase | undefined> {
	const event = events[0];
	if (event.type !== 'message' || !event.replyToken) {
		// ignore non-text-message event
		return;
	}
	console.log(event);

	if (event.message.type === 'text') {
		const text = event.message.text
		if (text == "จ่ายเงิน") {
			await replyMessage(config.channelAccessToken!, {
				replyToken: event.replyToken,
				messages: [
					{
						type: 'image',
						originalContentUrl: `${host}/api/qr.jpg`,
						previewImageUrl: `${host}/api/qr.jpg`
					},
				],
			});
		}

	}

	if (event.message.type === 'image') {
		let url = `https://api-data.line.me/v2/bot/message/${event.message.id}/content`;
		const path = __dirname + '/temp/temp.jpg';
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
		await delay(2000);
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
					// amount: number, // Add this to check with amount of the slip
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
				replyToken: event.replyToken,
				messages: [
					{
						type: 'text',
						text: "ชำระเงินเสร็จสิ้น ✅",
					},
				],
			});
		} catch (err) {
			// Handle invalid slip
			if (axios.isAxiosError(err)) {
				const errorData = (err as any).response.data;

				await replyMessage(config.channelAccessToken!, {
					replyToken: event.replyToken,
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
	}
}

// listen on port
const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`listening on ${port}`);
});
