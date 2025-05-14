import express from 'express';
import { router } from './routes/app.routes';
import { fetchSchedulesAndSetJobs } from './utils/schedule';
import nodeCron from 'node-cron';
import fs from 'fs'

import dotenv from 'dotenv';
dotenv.config();


const app = express();

app.use('/api', express.static('public'));
app.use("/", router);


const path = __dirname + '/temp'
const temp = fs.existsSync(path);
if (!temp) fs.mkdirSync(path);

// Poll every 30 seconds for new/changed tasks
nodeCron.schedule('*/30 * * * * *', fetchSchedulesAndSetJobs);

// Initial fetch
fetchSchedulesAndSetJobs();

// listen on port
const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`listening on ${port}`);
});
