import express from "express";
import ViteExpress from "vite-express";
import http from 'http';
import { Server } from 'socket.io';
import { router } from './src/routes/app.routes';
import { connectDB } from './src/config/db';

import morgan from 'morgan';
import cors, { CorsOptions } from 'cors';
import bodyParse from 'body-parser';

import fs from 'fs';
import path from 'path';

import { middleware } from '@line/bot-sdk';
import { LINE_CONFIG } from './src/utils/contant';
import { callbackFn } from './src/controllers/app.controller';
import { createSocketIO } from './src/utils/socket-event';
import dotenv from 'dotenv';
dotenv.config();

const corsOptions: CorsOptions = {
	origin: '*',
	credentials: false,
};

// Setup Express
const app = express();
const httpServer = http.createServer(app);
export const io = new Server(httpServer, {
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

	const tempPath = path.dirname("") + '/temp';
	const temp = fs.existsSync(tempPath);
	if (!temp) fs.mkdirSync(tempPath);


	// listen on port
	const port = process.env.PORT || 8080;
	const server = httpServer.listen(port);

  ViteExpress.bind(app, server, () => {
    console.log("Listen on http://localhost:"+port);
  });
};

startServer();
