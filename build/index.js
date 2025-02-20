"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_routes_1 = require("./routes/app.routes");
const schedule_1 = require("./utils/schedule");
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use('/api', express_1.default.static('public'));
app.use("/", app_routes_1.router);
const path = __dirname + '/temp';
const temp = fs_1.default.existsSync(path);
if (!temp)
    fs_1.default.mkdirSync(path);
// schedule
(0, schedule_1.sendSchedule)();
// listen on port
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});
