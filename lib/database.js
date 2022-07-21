const mysql = require('mysql2');

const pool = mysql.createPool({
    host:'localhost',
    port: '3306',
    user:'root',
    password:'',
    database:'TODAY_WORDS',
    connectionLimit : 10,
  });

const promisePool = pool.promise(); 
module.exports = promisePool;