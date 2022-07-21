const express = require('express')
const app = express()
const routes_path = require('./routes/index.js')
const cors = require('cors');
const mongoose   = require('mongoose');
const { swaggerUi, specs } = require('./src/swagger.js')
require("dotenv").config();
    
app.use(cors())

// Database
// mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGO_DB_LOGIN_API);
// var db = mongoose.connection;
// db.once('open', function () {
//    console.log('DB connected!');
// });
// db.on('error', function (err) {
//   console.log('DB ERROR:', err);
// });

// process.on('uncaughtException', (err) => {
//     console.error('예기치 못한 에러', err);
// });

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'content-type, x-access-token'); //1
    next();
});

app.use('/', routes_path);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer:true }))

app.listen(5001, function(){
    console.log("start! express server on port 5001")
})

module.exports = app;