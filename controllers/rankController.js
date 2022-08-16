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

const updateRank = async function (req, res) {
    const startDate  = req.params.startDate
    const result = await updateRankProc(startDate)
    res.json(result)
}

const updateRankProc = async function (date) {
    try {
        const data = {
            "startDate": `${date} 00:00:00`,
            "endDate": `${date} 23:59:59`
        }
        const result = await wordModel.getWordsTop100(data)
        if(result){
            result.forEach(async function(val, key){
                let rankData = {
                    'RL_RANK'       : (key + 1),
                    'RL_WORD'       : val.WL_NAME,
                    'RL_DATE'       : date
                }
                await rankModel.insertRank(rankData)
            })
        }
        return result
    } catch (e) {
        return e
    }
}

module.exports = {
    getRankByWord,
    updateRank,
    updateRankProc
}
