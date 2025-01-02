import express from 'express';
import { router } from './routes/app.routes';
import { sendSchedule } from './utils/schedule';
import fs from 'fs'

import dotenv from 'dotenv';
dotenv.config();


const app = express();

app.use('/api', express.static('public'));
app.use("/", router);


const path = __dirname + '/temp'
const temp = fs.existsSync(path);
if (!temp) fs.mkdirSync(path);

// schedule
sendSchedule();

// listen on port
const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`listening on ${port}`);
});
