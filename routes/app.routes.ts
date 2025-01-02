import { Router } from 'express';
import * as line from '@line/bot-sdk';
import { config } from '../utils/config';

import * as controller from '../controllers/app.controller';

import { Connect } from '../utils/mysql';

const router = Router();

router.get('/', (req, res) => {
	res.json({ text: 'Hello, world!' });
});

// router.get('/get', async (req, res) => {
// 	try {
// 		const connection = await Connect();

// 		let sql = 'SELECT * FROM groups';
// 		const [results] = await connection.execute(sql, []);
		
// 		connection.destroy();

// 		console.log(results);

// 		res.json(results);
// 	} catch (error) {
// 		console.error(error);
// 	}
// });

router.post('/callback', line.middleware(config), controller.callbackFn);
export { router };
