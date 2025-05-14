import { Router } from 'express';
import * as line from '@line/bot-sdk';
import { config } from '../utils/config';

import * as controller from '../controllers/app.controller';

import { Connect } from '../utils/mysql';

const router = Router();

router.get('/', (req, res) => {
	res.json({ text: 'Hello, world!' });
});

router.post('/callback', line.middleware(config), controller.callbackFn);
export { router };
