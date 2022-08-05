const db = require("../lib/database")

exports.getRankByWord = async function(word){
    let sql = `SELECT * FROM TBL_RANK_LIST WHERE RL_WORD = '${word}'`
    let [wordList, fields] = await db.query(sql)
    return wordList;
}
