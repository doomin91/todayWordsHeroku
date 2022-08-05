const rankModel = require("../models/rankModel")

const getRankByWord = async function (req, res) {
    try {
        const word = req.params.word
        const result = await rankModel.getRankByWord(word)
        res.status(200).json(result)
    } catch (e) {
        console.log(e)
        res.json(e)
    }
}

const updateRank = async function () {
    try {
        let data = {
            "startDate": req.params.startDate,
            "endDate": req.params.endDate
        }
        let result = await wordModel.getWords(data);
        res.status(200).json(result);
    } catch (e) {
        console.log(e)
        res.json(e)
    }
}

module.exports = {
    getRankByWord,
    updateRank
}
