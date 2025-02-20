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
const Connect = () => __awaiter(void 0, void 0, void 0, function* () { return yield promise_1.default.createConnection(params); });
exports.Connect = Connect;
