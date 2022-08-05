const replyModel = require("../models/replyModel")

const getReply = async function(req, res){
    try {
        const word = req.params.word
        const result = await replyModel.getReply(word)
        console.log(result)
        res.json(result)
    } catch(e) {
        res.json(e)
    }
}

const insertReply = async function(req, res){
    try {
        const data = {
            keyword           : req.body.keyword,
            parentReplySeq    : req.body.parentReplySeq,
            comment           : req.body.comment,
            nickname          : req.body.nickname,
            password          : req.body.password,
        }
        const result = await replyModel.insertReply(data)
        res.json(result)
    } catch(e) {
        res.json(e)
    }
}

const deleteReply = async function(req, res){
    console.log("deleteReply")
}

const updateReply = async function(req, res){
    console.log("updateReply")
}

module.exports = {
    getReply,
    insertReply,
    deleteReply,
    updateReply
}
