import * as line from '@line/bot-sdk';

import dotenv from 'dotenv';
dotenv.config();

export const config: line.MiddlewareConfig = {
	channelSecret: process.env.LINE_CHANNEL_SECRET!,
	channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN!,
};

const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_PORT = process.env.MYSQL_PORT || 3306;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'supercooldb';
const MYSQL_USER = process.env.MYSQL_USER || 'superuser';
const MYSQL_PASS = process.env.MYSQL_PASS || 'roseville';

const MYSQL = {
    host: MYSQL_HOST,
    port: MYSQL_PORT as number,
    database: MYSQL_DATABASE,
    user: MYSQL_USER,
    pass: MYSQL_PASS,
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 1337;

const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
};

export const db_config = {
    mysql: MYSQL,
    server: SERVER
};
