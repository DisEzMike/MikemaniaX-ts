"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.params = void 0;
const config_1 = require("./config");
exports.params = {
    user: config_1.db_config.mysql.user,
    password: config_1.db_config.mysql.pass,
    host: config_1.db_config.mysql.host,
    database: config_1.db_config.mysql.database,
    port: config_1.db_config.mysql.port
};
