const db = require("../lib/database")

exports.getRankByWord = async function(data){
    let sql = `SELECT * FROM TBL_RANK_LIST 
                WHERE RL_WORD = '${data.word}'
                AND RL_DATE > '${data.startDate}' AND RL_DATE <= '${data.endDate}'`
    let [wordList, fields] = await db.query(sql)
    return wordList;
}

exports.insertRank = async function(data){
    let sql = `INSERT INTO TBL_RANK_LIST (RL_RANK, RL_WORD, RL_DATE) VALUES (${data.RL_RANK}, '${data.RL_WORD}', '${data.RL_DATE}')`
    let [result, fields] = await db.execute(sql);
    return result
}
