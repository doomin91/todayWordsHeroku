const rankModel = require("../models/rankModel")
const wordModel = require("../models/wordModel")
const moment = require("moment")

const getRankByWord = async function (req, res) {
    try {
        const word      = req.params.word
        const startDate = req.params.startDate
        const endDate   = req.params.endDate
        const data = {
            'word' : word,
            'startDate' : startDate,
            'endDate' : endDate
        }
        const result    = await rankModel.getRankByWord(data)
        res.status(200).json(result)
    } catch (e) {
        console.log(e)
        res.json(e)
    }
}

const updateRank = async function () {
    try {
        let now = moment(new Date()).format("YYYY-MM-DD")
        // console.log(now)
        let data = {
            "startDate": `${now} 00:00:00`,
            "endDate": `${now} 23:59:59`
        }
        let result = await wordModel.getWordsTop100(data)
        if(result){
            result.forEach(async function(val, key){
                let rankData = {
                    'RL_RANK'       : (key + 1),
                    'RL_WORD'       : val.WL_NAME,
                    'RL_DATE'       : now
                }
                let result2 = await rankModel.insertRank(rankData)
                console.log(result2)
            })
        }
        // console.log(result)
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    getRankByWord,
    updateRank,
}
