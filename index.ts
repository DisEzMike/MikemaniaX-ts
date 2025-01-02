import express from 'express';
import { router } from './routes/app.routes';
import dotenv from 'dotenv';
import { sendSchedule } from './utils/schedule';
dotenv.config();


const app = express();

app.use('/api', express.static('public'));
app.use("/", router);

// schedule
sendSchedule();

// listen on port
const port = process.env.PORT || 8000;
app.listen(port, () => {
	console.log(`listening on ${port}`);
});
