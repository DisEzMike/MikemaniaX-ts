import { ConnectionOptions } from 'mysql2/promise';
import { db_config as config } from './config';

export const params: ConnectionOptions = {
	user: config.mysql.user,
	password: config.mysql.pass,
	host: config.mysql.host,
	database: config.mysql.database,
    port: config.mysql.port
};