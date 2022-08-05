const schedule = require('node-schedule');
const wordController = require('../controllers/wordController');

console.log("started scheduler");
const job = schedule.scheduleJob('*/60 * * * *', function(){
    wordController.crollingNewsFromNaverNews();
})

module.exports = job