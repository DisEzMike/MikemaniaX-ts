import { Router } from "express";
import * as line from '@line/bot-sdk';
import { config } from "../utils/line";

import * as controller from "../controllers/app.controller"

const router = Router();

router.get('/', (req, res) => {
	res.json({ text: 'Hello, world!' });
});

router.post('/callback', line.middleware(config), controller.callbackFn);


export { router }