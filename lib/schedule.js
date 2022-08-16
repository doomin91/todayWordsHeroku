const schedule = require('node-schedule');
const wordController = require('../controllers/wordController');
const rankController = require('../controllers/rankController');

const job = schedule.scheduleJob('*/60 * * * *', function(){
    wordController.crollingNewsFromNaverNews();
})

const job2 = schedule.scheduleJob('* 22 * * *', function(){
    console.log("랭킹이 업데이트 되었습니다.")
    rankController.updateRank();
})

module.exports = {
    job,
    job2
}