const db = require("../lib/database")

exports.getReply = async function(word){
    let sql = `SELECT * FROM TBL_WORD_REPLY WHERE WR_KEYWORD = '${word}' AND WR_DEL_YN = 'N'`;
    let [wordList, fields] = await db.query(sql);
    return wordList;
}

exports.insertReply = async function(data){
    let sql = `INSERT INTO TBL_WORD_REPLY (WR_KEYWORD, WR_PARENT_SEQ, WR_COMMENT, WR_NICKNAME, WR_PASSWORD) VALUES ('${data.keyword}', '${data.parentReplySeq}', '${data.comment}', '${data.nickname}','${data.password}')`
    let [result, fields] = await db.execute(sql);
    return result
}

exports.deleteReply = async function(wordSeq){
    let sql = `UPDATE TBL_WORD_LIST SET WL_DEL_YN = 'Y' WHERE WL_SEQ = ${wordSeq}`

    let [result, fields] = await db.execute(sql);
    return result
}
