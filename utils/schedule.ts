import mysql from 'mysql2/promise';
import schedule from 'node-schedule';
// import nodeCron from 'node-cron';
import { config } from './config';
import { pushMessage } from './line';
import { params } from './mysql';
import { fetchCurrency } from './currency';

interface TASK {
	[propName: number]: schedule.Job;
}

interface USER {
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
	  scheduledTasks[id].cancel();
	  delete scheduledTasks[id];
	}

	// Set new tasks
	(rows as USER[]).forEach((task) => {
		const now =  new Date();
		const date = now.toLocaleDateString('th-TH', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})

		// const cronExpr = `45 * ${schedule.round} * *`;
		// console.log(cronExpr)
		const cronExpr = `*/2 * * * *`;

		scheduledTasks[task.id] = schedule.scheduleJob(cronExpr, async () => {
		console.log(`Running task: ${task.id}`);
		
		await pushMessage(config.channelAccessToken!, {
			to: task.user_id,
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
											text: `${task.title}`,
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
											text: `฿${task.amount}`,
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

export const fetchCurrencySchedules = async () => {
	const connection = await mysql.createConnection(params);
	const [rows] = await connection.execute('SELECT users.id, user_id from users where active=1 AND role=1');
	connection.end();
	// Clear existing tasks
	for (let id in scheduledTasks) {
	  scheduledTasks[id].cancel();
	  delete scheduledTasks[id];
	}

	// Set new tasks
	(rows as USER[]).forEach(async (task) => {
		const now =  new Date();
		const date = now.toLocaleDateString('th-TH', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})

		// const cronExpr = `45 * ${schedule.round} * *`;
		// console.log(cronExpr)
		// const cronExpr = `*/1 * * * *`;
		const cronExpr = `0 9 * * *`;

		const data = await fetchCurrency();
		const currency = data.data.usd;

		scheduledTasks[task.id] = schedule.scheduleJob(cronExpr, async () => {
		console.log(`Running task: Send Currency Schedule!`);
		
		await pushMessage(config.channelAccessToken!, {
			to: task.user_id,
			messages: [
				{
					type: 'flex',
					altText: `อัพเดทค่าเงินมาแล้ว✨ 1 USD = ${Math.floor(currency['thb'] * 100) / 100} THB !`,
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
											text: '💰 อัพเดทค่าเงินมาแล้ว!',
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
											text: `1 USD`,
											flex: 3,
											color: '#C7253E',
											size: "xl"
										},
										{
											type: 'text',
											text: `${Math.floor(currency['thb'] * 100) / 100} THB`,
											wrap: true,
											color: '#009900',
											size: 'xl',
											flex: 3,
											gravity: 'bottom',
										},
									],
									paddingAll: '5px',
									margin: "10px"
								},
							]
						}
					},
				},
			],
		});
	  });
	});
  
	console.log('Schedules updated.');
}