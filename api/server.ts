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
import { createServer } from 'vite';
import { createSocketIO } from './src/utils/socket-event';
dotenv.config();

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
	createSocketIO(io);

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
