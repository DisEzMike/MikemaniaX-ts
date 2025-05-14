"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connect = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const config_1 = require("./config");
const params = {
    user: config_1.db_config.mysql.user,
    password: config_1.db_config.mysql.pass,
    host: config_1.db_config.mysql.host,
    database: config_1.db_config.mysql.database,
    port: config_1.db_config.mysql.port
};
const Connect = () => promise_1.default.createConnection(params);
exports.Connect = Connect;
