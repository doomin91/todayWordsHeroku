const db = require("../lib/database")

exports.getWords = async function(){
    let sql = `SELECT * FROM TBL_WORD_LIST WHERE WL_DEL_YN = 'N'`;
    let [wordList, fields] = await db.query(sql);
    return wordList;
}

exports.insertWord = async function(data){
    let sql = `INSERT INTO TBL_WORD_LIST (WL_CATE, WL_NAME, WL_RELATED_WORDS, WL_RELATED_NEWS, WL_URL, WL_WORD_RANK, WL_IMPORTANCE) VALUES ('${data.cate}', '${data.name}', '${data.relatedWords}', '${data.relatedNews}','${data.url}', ${data.wordRank}, ${data.importance})`

    let [result, fields] = await db.execute(sql);
    return result
}

exports.deleteWord = async function(wordSeq){
    let sql = `UPDATE TBL_WORD_LIST SET WL_DEL_YN = 'Y' WHERE WL_SEQ = ${wordSeq}`

    let [result, fields] = await db.execute(sql);
    return result
}


exports.getRawData = async function (){
    let sql = `SELECT * FROM TBL_RAW_DATA WHERE ANALYSYS_YN = 'N'`;
    let [rawData, fields] = await db.query(sql);
    return rawData;
}

exports.getRawDataById = async function (id){
    let sql = `SELECT * FROM TBL_RAW_DATA WHERE ID = ${id}`;
    let [rawData, fields] = await db.query(sql);
    return rawData;
}

exports.updateRawData = async function (id){
    let sql = `UPDATE TBL_RAW_DATA SET ANALYSYS_YN = 'Y' WHERE ID = ${id}`

    let [result, fields] = await db.execute(sql);
    return result
}

exports.insertRawData = async function (data){
    let sql = `INSERT INTO TBL_RAW_DATA (ID, CODE, TITLE, URL, CONTENT, REG_DATE, MOD_DATE) VALUES (
        '${data.id}',
        '${data.code}',
        '${escapeString(data.title)}',
        '${data.url}',
        '${escapeString(data.content)}}',
        '${isEmpty(data.regDate)}',
        '${isEmpty(data.modDate)}')`
        
    let [result, fields] = await db.execute(sql);
    return result
}

function escapeString(str){
    str = str.replace(/\\/g, "\\\\")
        .replace(/\$/g, "\\$")
        .replace(/'/g, "\\'")
        .replace(/"/g, "\\\"")
        .trim()
    return str
}

function isEmpty(str){
    if(str == undefined || str == null || str == ""){
        return ""
    }
    return str
}

exports.getAllNode = async function(todoSeq){
    let sql, node, result=[], isNullTail=false;
    // Head Search
    sql = `SELECT * FROM TBL_CARD_LIST WHERE 
    CL_DEL_YN = 'N' AND CL_PARENT_SEQ = ${todoSeq} AND CL_PREV IS NULL`;
    let [head, field] = await db.query(sql);
    if(head[0]){
        node = head;
        result.push(node[0]);
        while(!isNullTail){
            // Tail Search # ?????? ?????? ?????? NULL?????? ??????
            if(node[0].CL_NEXT == null){
                isNullTail = true;
            } else {
                sql = `SELECT * FROM TBL_CARD_LIST WHERE
                CL_DEL_YN = 'N' AND CL_PARENT_SEQ = ${todoSeq} AND CL_SEQ = ${node[0].CL_NEXT}`;
                [node, field] = await db.query(sql)
                result.push(node[0]);
            }
        }
        return result
    } else {
        return result;
    }
}

async function getNodeByIndex(todoSeq, idx){
    let sql, node, cnt=0, result, isNullTail=false;
    // Head Search
    sql = `SELECT * FROM TBL_CARD_LIST WHERE 
    CL_DEL_YN = 'N' AND CL_PARENT_SEQ = ${todoSeq} AND CL_PREV IS NULL`;
    let [head, field] = await db.query(sql);
    if(head[0]){
        node = head;
        while(!isNullTail){
            result = node[0];
            cnt++;
            if(cnt == idx){
                return result;
            }
            // Tail Search # ?????? ?????? ?????? NULL?????? ??????
            if(node[0].CL_NEXT == null){
                isNullTail = true;
            } else {
                sql = `SELECT * FROM TBL_CARD_LIST WHERE
                CL_DEL_YN = 'N' AND CL_PARENT_SEQ = ${todoSeq} AND CL_SEQ = ${node[0].CL_NEXT}`;
                [node, field] = await db.query(sql)
            }
        }
    } else {
        return result;
    }
}

exports.getPrevNode = async function(cardSeq, todoSeq){
    let sql = `
    SELECT * FROM TBL_CARD_LIST 
    WHERE CL_PARENT_SEQ = ${todoSeq} AND CL_DEL_YN = 'N'
    AND CL_NEXT = ${cardSeq}`;
    let [prev, fields] = await db.query(sql);
    return prev;
}

exports.getNextNode = async function(cardSeq, todoSeq){
    let sql = `
    SELECT * FROM TBL_CARD_LIST 
    WHERE CL_PARENT_SEQ = ${todoSeq} AND CL_DEL_YN = 'N'
    AND CL_PREV = ${cardSeq}`;
    let [next, fields] = await db.query(sql);
    return next;
}

exports.getPrevNodeByIndex = async function(todoSeq, futureIndex){
    let sql = `
    SELECT * FROM TBL_CARD_LIST 
    WHERE CL_PARENT_SEQ = ${todoSeq} AND CL_DEL_YN = 'N'
    ORDER BY CL_PREV
    LIMIT ${futureIndex-1}, 1`;
    let [prev, fields] = await db.query(sql);
    return prev;
}

exports.getNextNodeByIndex = async function(todoSeq, futureIndex){
    let sql = `
    SELECT * FROM TBL_CARD_LIST 
    WHERE CL_PARENT_SEQ = ${todoSeq} AND CL_DEL_YN = 'N'
    ORDER BY CL_PREV
    LIMIT ${futureIndex}, 1`;
    let [next, fields] = await db.query(sql);
    return next;
}

exports.insertList = async function(body) {
    let sql = `INSERT INTO TBL_TODO_LIST (TL_TITLE)
        VALUES ('${body.name}')`
        
    let result = await db.execute(sql);

    return result;
}

exports.findCardById = async function(cardSeq) {
    let sql = `SELECT * FROM TBL_CARD_LIST WHERE CL_SEQ = ${cardSeq}`;
    let [result, fields] = await db.query(sql);
    return result;
}

exports.insertCard = async function(body) {
    // Linked List ??????
    let sql, result, prevSeq;
    // ?????? Row??? ???????????? ??????, ?????? Row??? Seq ?????? PREV ?????? ????????????.
    sql = `SELECT CL_SEQ FROM TBL_CARD_LIST WHERE CL_DEL_YN='N' AND CL_PARENT_SEQ = ${body.id} AND CL_NEXT IS NULL` 
    let [prev, fields] = await db.query(sql);
    if(prev[0]){
        prevSeq = prev[0].CL_SEQ;
    } else {
        prevSeq = null;
    }

    // PREV ?????? ?????? ????????? Row??? ???????????????.
    sql = `INSERT INTO TBL_CARD_LIST (CL_PARENT_SEQ, CL_PREV, CL_NEXT, CL_TITLE)
    VALUES (${body.id}, ${prevSeq}, null,'${body.name}')`;
    [result, fields] = await db.execute(sql);
    
    // ?????? ?????? ??? ????????? ?????? ?????? ?????? ???????????????, ?????? ????????? NEXT ?????? ???????????????.
    if(result.insertId && prev[0]){
        sql = `UPDATE TBL_CARD_LIST SET CL_NEXT = ${result.insertId} WHERE CL_SEQ = ${prevSeq}`
        let update = await db.execute(sql);
    }

    return result;
}


exports.unlinkNode = async function(cardSeq, oldParentSeq){
    let sql, curRowUpt, prevRowUpt, nextRowUpt;
    let prev = await this.getPrevNode(cardSeq, oldParentSeq);
    let next = await this.getNextNode(cardSeq, oldParentSeq);
    if(prev[0] && next[0]){
        sql = `UPDATE TBL_CARD_LIST SET CL_NEXT = ${next[0].CL_SEQ} WHERE CL_SEQ = ${prev[0].CL_SEQ}`
        prevRowUpt = await db.execute(sql);
        sql = `UPDATE TBL_CARD_LIST SET CL_PREV = ${prev[0].CL_SEQ} WHERE CL_SEQ = ${next[0].CL_SEQ}`
        nextRowUpt = await db.execute(sql);
        sql = `UPDATE TBL_CARD_LIST SET CL_DEL_YN = 'Y' WHERE CL_SEQ = ${cardSeq}`;
        curRowUpt = await db.execute(sql);
    } else if(prev[0]){
        sql = `UPDATE TBL_CARD_LIST SET CL_NEXT = null WHERE CL_SEQ = ${prev[0].CL_SEQ}`
        prevRowUpt = await db.execute(sql);
        sql = `UPDATE TBL_CARD_LIST SET CL_DEL_YN = 'Y' WHERE CL_SEQ = ${cardSeq}`;
        curRowUpt = await db.execute(sql);
    } else if(next[0]){
        sql = `UPDATE TBL_CARD_LIST SET CL_PREV = null WHERE CL_SEQ = ${next[0].CL_SEQ}`
        nextRowUpt = await db.execute(sql);
        sql = `UPDATE TBL_CARD_LIST SET CL_DEL_YN = 'Y' WHERE CL_SEQ = ${cardSeq}`;
        curRowUpt = await db.execute(sql);
    } else {
        sql = `UPDATE TBL_CARD_LIST SET CL_DEL_YN = 'Y' WHERE CL_SEQ = ${cardSeq}`;
        curRowUpt = await db.execute(sql);
    }

    return [prevRowUpt, curRowUpt, nextRowUpt];
}

exports.linkNode = async function(cardSeq, newParentSeq, futureIndex){
    let sql, curRowUpt, prevRowUpt, nextRowUpt;

    // ????????? ????????? prev, next??? ?????????.
    let prev = await getNodeByIndex(newParentSeq, futureIndex);
    let next = await getNodeByIndex(newParentSeq, futureIndex+1);

    if(prev && next){
        sql = `UPDATE TBL_CARD_LIST SET CL_PARENT_SEQ = ${newParentSeq}, CL_PREV = ${prev.CL_SEQ}, CL_NEXT = ${next.CL_SEQ}, CL_DEL_YN = 'N' WHERE CL_SEQ = ${cardSeq}`;
        curRowUpt = await db.execute(sql);
        sql = `UPDATE TBL_CARD_LIST SET CL_NEXT = ${cardSeq} WHERE CL_SEQ = ${prev.CL_SEQ}`
        prevRowUpt = await db.execute(sql);
        sql = `UPDATE TBL_CARD_LIST SET CL_PREV = ${cardSeq} WHERE CL_SEQ = ${next.CL_SEQ}`
        nextRowUpt = await db.execute(sql);
    } else if(prev){
        sql = `UPDATE TBL_CARD_LIST SET CL_NEXT = ${cardSeq} WHERE CL_SEQ = ${prev.CL_SEQ}`
        prevRowUpt = await db.execute(sql);
        sql = `UPDATE TBL_CARD_LIST SET CL_NEXT = null, CL_PREV = ${prev.CL_SEQ}, CL_DEL_YN = 'N', CL_PARENT_SEQ = ${newParentSeq} WHERE CL_SEQ = ${cardSeq}`;
        curRowUpt = await db.execute(sql);
    } else if(next){
        sql = `UPDATE TBL_CARD_LIST SET CL_PREV = ${cardSeq} WHERE CL_SEQ = ${next.CL_SEQ}`
        nextRowUpt = await db.execute(sql);
        sql = `UPDATE TBL_CARD_LIST SET CL_PREV = null, CL_NEXT = ${next.CL_SEQ}, CL_DEL_YN = 'N', CL_PARENT_SEQ = ${newParentSeq} WHERE CL_SEQ = ${cardSeq}`;
        curRowUpt = await db.execute(sql);
    } else {
        sql = `UPDATE TBL_CARD_LIST SET CL_DEL_YN = 'N', CL_PREV = null, CL_NEXT = null, CL_PARENT_SEQ = ${newParentSeq} WHERE CL_SEQ = ${cardSeq}`;
        curRowUpt = await db.execute(sql);
    }

    return [prevRowUpt, curRowUpt, nextRowUpt];
}