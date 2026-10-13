import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'db_lppm',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});