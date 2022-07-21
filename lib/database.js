const mysql = require('mysql2');

const pool = mysql.createPool({
    host:'125.129.156.53',
    port: '23306',
    user:'root',
    password:'1234',
    database:'TODAY_WORDS',
    connectionLimit : 10,
  });

const promisePool = pool.promise(); 
module.exports = promisePool;