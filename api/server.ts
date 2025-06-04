import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { router } from './src/routes/app.routes';
import { connectDB } from './src/config/db';

import morgan from 'morgan';
import cors, { CorsOptions } from 'cors';
import bodyParse from 'body-parser';

import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';
import { middleware } from '@line/bot-sdk';
import { LINE_CONFIG } from './src/utils/contant';
import { callbackFn } from './src/controllers/app.controller';
import { Message } from './src/models/chat';
import { createServer } from 'vite';
import { pushMessage } from './src/utils/line';
import { v4 } from 'uuid';
dotenv.config();
//   // Define Message Schema

const corsOptions: CorsOptions = {
	origin: '*',
	credentials: false,
};

// Setup Express
const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
	cors: corsOptions,
});

const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
} as any;

Object.keys(originalConsole).forEach((method) => {
	(console as any)[method] = (...arg: string[]) => {
		let type = method;
		if (method == 'log') {
			type = `\u001b[32m${method.toLocaleUpperCase()}\u001b[0m`
		} else if (method == 'warn') {
			type = `\u001b[33m${method.toLocaleUpperCase()}\u001b[0m`
		} else if (method == 'error') {
			type = `\u001b[31m${method.toLocaleUpperCase()}\u001b[0m`
		} else {
			type = `\u001b[36m${method.toLocaleUpperCase()}\u001b[0m`
		}
		const message = `[${type}] ${arg.map(log => typeof log === 'object' ? JSON.stringify(log) : log).join(" ")}`;
		const output = {id:v4(), message};
		originalConsole[method](message);
		io.emit("log", output);
	};
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const startServer = async () => {
	await connectDB();

	app.use(morgan('dev', {
		stream: {
			write: (message) => {
				console.log("[\u001b[33mHTTP\u001b[0m]", message.trim());
			}
		}
	}));

	app.use('/api/callback', middleware(LINE_CONFIG), callbackFn);

	// Socket.io connection
	io.on('connection', (socket) => {
		socket.on('join chat', async ({ room }) => {
			socket.join(room);
			console.log('User connected');
			// Load and send previous messages for that room
			const messages = await Message.find({ room })
				.select('-room')
				.sort({ timestamp: 1 })
				.limit(50);
			socket.emit('chat history', messages);
		});

		socket.on('chat message', async ({ room, userId, message }) => {
			console.log('User message');
			const msg = new Message({ room, userId, message });
			await msg.save();
			io.to(room).emit('chat message', msg); // Only to users in the room

			await pushMessage({
				to: room,
				messages: [
					{
						type: 'text',
						text: message,
					},
				],
			});
		});

		socket.on('disconnect', () => {
			console.log('User disconnected');
		});
	});

	app.use(cors(corsOptions));
	app.use(bodyParse.json());
	app.use('/api', router);
	
	app.use(express.static('public'));

	const tempPath = __dirname + '/temp';
	const temp = fs.existsSync(tempPath);
	if (!temp) fs.mkdirSync(tempPath);

	const vite = await createServer({
		server: { middlewareMode: true, allowedHosts: true },
		root: path.resolve(__dirname, '../client'),
	});
	app.use(vite.middlewares);

	// listen on port
	const port = process.env.PORT || 8080;
	server.listen(port, () => {
		console.log(`listening on ${port}`);
	});
};

startServer();
