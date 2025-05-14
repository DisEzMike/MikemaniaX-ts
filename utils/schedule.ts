import mysql from 'mysql2/promise';
// import schedule from 'node-schedule';
import nodeCron from 'node-cron';
import { config } from './config';
import { pushMessage } from './line';
import { params } from './mysql';

interface TASK {
	[propName: number]: any;
}

interface Value {
	id: number;
	user_id: string;
	title: string;
	amount: number;
	round: number;
}

let scheduledTasks:TASK = {}

export const fetchSchedulesAndSetJobs = async () => {
	const connection = await mysql.createConnection(params);
	const [rows] = await connection.execute('SELECT users.id, user_id, `title`, amount, `round` from users INNER JOIN groups ON users.group=groups.id where active=1');
	connection.end();
	// Clear existing tasks
	for (let id in scheduledTasks) {
	  scheduledTasks[id].stop();
	  delete scheduledTasks[id];
	}

	// Set new tasks
	(rows as Value[]).forEach((schedule) => {
		const now =  new Date();
		const date = now.toLocaleDateString('th-TH', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})

		// const cronExpr = `* * ${schedule.round} * *`;
		const cronExpr = `*/5 * * * * *`;

		scheduledTasks[schedule.id] = nodeCron.schedule(cronExpr, async () => {
		console.log(`Running task: ${schedule.id}`);
		
		await pushMessage(config.channelAccessToken!, {
			to: schedule.user_id,
			messages: [
				{
					type: 'flex',
					altText: 'บิลมาแล้วจ้า',
					contents: {
						type: 'bubble',
						body: {
							type: 'box',
							layout: 'vertical',
							contents: [
								{
									type: 'box',
									layout: 'vertical',
									contents: [
										{
											type: 'text',
											text: '🗓️ รอบเก็บเงินมาแล้ว!',
											weight: 'bold',
											size: 'lg',
											color: '#C7253E',
											align: 'start',
										},
										{
											type: 'text',
											text: `วันที่ ${date}`,
											offsetTop: '10px',
											color: '#888888',
										},
									],
									paddingBottom: '10px',
								},
								{
									type: 'separator',
									margin: '10px',
								},
								{
									type: 'box',
									layout: 'baseline',
									spacing: 'sm',
									contents: [
										{
											type: 'text',
											text: `${schedule.title}`,
											flex: 2,
											color: '#C7253E',
										},
										{
											type: 'text',
											text: 'ราคา',
											color: '#888888',
											size: 'sm',
											flex: 2,
											align: 'end',
											offsetEnd: '20px',
											gravity: 'bottom',
										},
										{
											type: 'text',
											text: `฿${schedule.amount}`,
											wrap: true,
											color: '#009900',
											size: 'xxl',
											flex: 2,
											gravity: 'bottom',
										},
									],
									paddingAll: '5px',
								},
								{
									type: 'separator',
									margin: '10px',
								},
							],
						},
						footer: {
							type: 'box',
							layout: 'vertical',
							spacing: 'sm',
							contents: [
								{
									type: 'button',
									style: 'link',
									action: {
										type: 'message',
										label: 'จ่ายเลย!',
										text: 'จ่ายเงิน',
									},
									height: 'sm',
									offsetTop: '0px',
									color: '#C7253E',
								},
							],
							flex: 0,
							paddingTop: '0px',
							paddingStart: '0px',
							paddingEnd: '0px',
							paddingBottom: '10px',
						},
					},
				},
			],
		});
	  });
	});
  
	console.log('Schedules updated.');
}