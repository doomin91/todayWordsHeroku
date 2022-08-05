const schedule = require('node-schedule');
const wordController = require('../controllers/wordController');

console.log("started scheduler");
const job = schedule.scheduleJob('*/1 * * * *', function(){
    wordController.crollingNewsFromNaverNews();
})

module.exports = job