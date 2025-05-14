"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.callbackFn = void 0;
const line = __importStar(require("@line/bot-sdk"));
const line_1 = require("../utils/line");
const fs_1 = __importDefault(require("fs"));
const jimp_1 = require("jimp");
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("../utils/config");
const mysql_1 = require("../utils/mysql");
dotenv_1.default.config();
const host = process.env.HOST;
const qrCodeReader = require('qrcode-reader');
const client = new line.messagingApi.MessagingApiClient({
    channelAccessToken: config_1.config.channelAccessToken,
});
const callbackFn = (req, res) => {
    try {
        const result = handleEvent(req.body.events);
        res.json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).end();
    }
};
exports.callbackFn = callbackFn;
function handleEvent(events) {
    return __awaiter(this, void 0, void 0, function* () {
        const event = events[0];
        if (event.type === 'message') {
            if (event.message.type === 'text') {
                try {
                    const cmd = event.message.text.split(" ");
                    if (cmd[0] == 'จ่ายเงิน') {
                        yield (0, line_1.replyMessage)(config_1.config.channelAccessToken, {
                            replyToken: event.replyToken,
                            messages: [
                                {
                                    type: 'image',
                                    originalContentUrl: `${host}/api/qr.jpg`,
                                    previewImageUrl: `${host}/api/qr.jpg`,
                                },
                            ],
                        });
                    }
                    else if (cmd[0] == "/reply") {
                        let user_id = cmd[1];
                        const text = cmd.slice(2).join(" ");
                        let connection = yield (0, mysql_1.Connect)();
                        let [rows] = yield connection.execute("SELECT user_id FROM users WHERE role=1");
                        connection.end();
                        const admin = rows[0];
                        if (event.source.userId != admin.user_id)
                            return;
                        connection = yield (0, mysql_1.Connect)();
                        [rows] = yield connection.execute(`SELECT user_id FROM users WHERE id=?`, [user_id]);
                        const user = rows[0];
                        yield (0, line_1.pushMessage)(config_1.config.channelAccessToken, {
                            to: user.user_id,
                            messages: [
                                {
                                    type: "text",
                                    text: text
                                }
                            ]
                        });
                    }
                    else {
                        let connection = yield (0, mysql_1.Connect)();
                        let [rows] = yield connection.execute("SELECT user_id FROM users WHERE role=1");
                        connection.end();
                        const admin = rows[0];
                        if (event.source.userId == admin.user_id)
                            return;
                        connection = yield (0, mysql_1.Connect)();
                        [rows] = yield connection.execute(`SELECT id FROM users WHERE user_id=?`, [event.source.userId]);
                        const user = rows[0];
                        yield (0, line_1.pushMessage)(config_1.config.channelAccessToken, {
                            to: admin.user_id,
                            messages: [
                                {
                                    type: "text",
                                    text: `ID : ${user.id}`
                                },
                                {
                                    type: "text",
                                    text: cmd.join(" ")
                                }
                            ]
                        });
                    }
                }
                catch (error) {
                    console.error(error);
                }
            }
            if (event.message.type === 'image') {
                try {
                    let url = `https://api-data.line.me/v2/bot/message/${event.message.id}/content`;
                    const path = __dirname + '/../temp/temp.jpg';
                    let writer = fs_1.default.createWriteStream(path);
                    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
                    const resp = yield axios_1.default.get(url, {
                        responseType: 'stream',
                        headers: {
                            Authorization: `Bearer ${config_1.config.channelAccessToken}`,
                        },
                    });
                    yield resp.data.pipe(writer);
                    yield delay(2500);
                    const buffer = fs_1.default.readFileSync(path);
                    const image = yield jimp_1.Jimp.read(buffer);
                    const qrCodeInstance = new qrCodeReader();
                    var data = '';
                    qrCodeInstance.callback = function (err, value) {
                        if (err) {
                            console.error(err);
                        }
                        // __ Printing the decrypted value __ \\
                        data = value.result;
                        fs_1.default.unlinkSync(path);
                        return value.result;
                    };
                    qrCodeInstance.decode(image.bitmap);
                    try {
                        const url = process.env.API_URL;
                        const apiKey = process.env.API_KEY;
                        const res = yield axios_1.default.post(url, {
                            data,
                            log: true,
                        }, {
                            headers: {
                                'x-authorization': apiKey,
                            },
                        });
                        // Handle success slip
                        const slipData = res.data.data;
                        yield (0, line_1.replyMessage)(config_1.config.channelAccessToken, {
                            replyToken: event.replyToken,
                            messages: [
                                {
                                    type: 'text',
                                    text: 'ชำระเงินเสร็จสิ้น ✅',
                                },
                            ],
                        });
                    }
                    catch (err) {
                        // Handle invalid slip
                        if (axios_1.default.isAxiosError(err)) {
                            const errorData = err.response.data;
                            yield (0, line_1.replyMessage)(config_1.config.channelAccessToken, {
                                replyToken: event.replyToken,
                                messages: [
                                    {
                                        type: 'text',
                                        text: errorData.message,
                                    },
                                ],
                            });
                            return;
                        }
                        console.log(err);
                    }
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
        else if (event.type === 'follow') {
            const user = event.source;
            if (!(user === null || user === void 0 ? void 0 : user.userId))
                return;
            const conn = yield (0, mysql_1.Connect)();
            let sql = 'SELECT * FROM users WHERE user_id=?';
            let [results, fields] = yield conn.execute(sql, [user.userId]);
            results = results;
            if (results.length == 1)
                return;
            sql = 'INSERT INTO users(user_id) VALUE(?)';
            [results, fields] = yield conn.execute(sql, [user.userId]);
            conn.end();
        }
        return;
    });
}
