import * as line from '@line/bot-sdk';
import dotenv from 'dotenv';

dotenv.config();

export const LINE_CONFIG: line.MiddlewareConfig = {
	channelSecret: process.env.LINE_CHANNEL_SECRET!,
	channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
};

export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT
export const DB_DATABASE = process.env.DB_DATABASE

export const DB_URL = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`