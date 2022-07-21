const authModel = require("../models/authModel")
const axios = require("axios")
const cheerio = require("cheerio")
const Iconv = require("iconv-lite")
const jwt = require('jsonwebtoken')

const login = async function(req, res) {
    try{
        const payload = {
            _id: "admin",
            username: "1234"
        }
        jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: "7d"}, function(err, token){
            if(err) return res.json(err);
            res.json(token);
          });
    } catch (e){
        res.json(e)
    }
}
const me = async function(req, res) {
    try{
        const token = req.headers['x-access-token']
        console.log(token)
        if (!token) return res.json('token is required!');
        jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
            if(err) return res.json(err);
            else{
                req.decoded = decoded;
                res.json(decoded)
            }
        });
    } catch (e){
        res.json(e)
    }
}
const refresh = async function(req, res) {
    try{
        res.json("1")
    } catch (e){
        res.json(e)
    }
}
const getUsers = async function(req, res) {
    try{
        res.json("1")
    } catch (e){
        res.json(e)
    }
}
const getUserByName = async function(req, res) {
    try{
        res.json("1")
    } catch (e){
        res.json(e)
    }
}
const insertUser = async function(req, res) {
    try{
        res.json("1")
    } catch (e){
        res.json(e)
    }
}
const updateUser = async function(req, res) {
    try{
        res.json("1")
    } catch (e){
        res.json(e)
    }
}
const deleteUser = async function(req, res) {

}

module.exports = {
    login,
    me,
    refresh,
    getUsers,
    getUserByName,
    insertUser,
    updateUser,
    deleteUser,
}
