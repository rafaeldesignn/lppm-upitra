"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
exports.db = promise_1.default.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'db_lppm',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
