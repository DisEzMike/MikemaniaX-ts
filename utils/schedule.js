"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSchedulesAndSetJobs = void 0;
// import schedule from 'node-schedule';
const mysql_1 = require("./mysql");
const node_cron_1 = __importDefault(require("node-cron"));
const config_1 = require("./config");
const line_1 = require("./line");
let scheduledTasks = {};
const fetchSchedulesAndSetJobs = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield (0, mysql_1.Connect)();
    const [rows] = yield connection.execute('SELECT users.id, user_id, `title`, amount, `round` from users INNER JOIN groups ON users.group=groups.id where active=1');
    // Clear existing tasks
    for (let id in scheduledTasks) {
        scheduledTasks[id].stop();
        delete scheduledTasks[id];
    }
    // Set new tasks
    rows.forEach((schedule) => {
        const now = new Date();
        const date = now.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        // const cronExpr = `* * ${schedule.round} * *`;
        const cronExpr = `*/5 * * * * *`;
        scheduledTasks[schedule.id] = node_cron_1.default.schedule(cronExpr, () => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`Running task: ${schedule.id}`);
            yield (0, line_1.pushMessage)(config_1.config.channelAccessToken, {
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
        }));
    });
    connection.end();
    console.log('Schedules updated.');
});
exports.fetchSchedulesAndSetJobs = fetchSchedulesAndSetJobs;
