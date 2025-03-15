import schedule from 'node-schedule';
import { Connect } from './mysql';
import { config } from './config';
import { pushMessage } from './line';

export const sendSchedule = async () => {
	const conn = await Connect();

	conn.execute('SELECT * FROM groups').then(([results, fields]) => {
		results = results as any[];

		results.forEach(async (val, i) => {
			try {
				const group = val as any;
				let sql = 'SELECT user_id FROM users WHERE `group`=?';
				let [datas] = await conn.execute(sql, [(val as any).id]);
				datas = datas as any[];

				if (datas.length == 0) return;
				datas.forEach(async (data, i) => {
					const user = data as any;
                    const now =  new Date();

                    const date = now.toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
					schedule.scheduleJob(`0 9 ${group.round} * *`, async () => {
						console.log('Running Task!');
						await pushMessage(config.channelAccessToken!, {
							to: user.user_id,
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
															text: `${group.name}`,
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
															text: `฿${group.amount}`,
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
			} catch (e: any) {
				console.log(e.response.data);
			}
		});

		conn.end();
	});
};
