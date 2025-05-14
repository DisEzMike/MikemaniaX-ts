"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db_config = exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    channelSecret: process.env.LINE_CHANNEL_SECRET,
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
};
const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_PORT = process.env.MYSQL_PORT || 3306;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'supercooldb';
const MYSQL_USER = process.env.MYSQL_USER || 'superuser';
const MYSQL_PASS = process.env.MYSQL_PASS || 'roseville';
const MYSQL = {
    host: MYSQL_HOST,
    port: MYSQL_PORT,
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
exports.db_config = {
    mysql: MYSQL,
    server: SERVER
};
