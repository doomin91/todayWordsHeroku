const schedule = require('node-schedule');
const wordController = require('../controllers/wordController');
const rankController = require('../controllers/rankController');
const moment = require("moment")

const job = schedule.scheduleJob('*/60 * * * *', function(){
    wordController.crollingNewsFromNaverNews();
})

const job2 = schedule.scheduleJob('*/1 * * * *', async function(){
    try {
        console.log("랭킹이 업데이트 되었습니다.")
        const date = moment(new Date).format("YYYY-MM-DD")
        // const date = "2022-08-16"
        const result = await rankController.updateRankProc(date)
        console.log(result)
    } catch(e) {
        console.log(e)
    }
})

module.exports = {
    job,
    job2
}