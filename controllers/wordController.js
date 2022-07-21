const wordModel = require("../models/wordModel")
const axios = require("axios")
const cheerio = require("cheerio")
const Iconv = require("iconv-lite")

const getWords = async function (req, res) {
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

const insertWord = async function (req, res) {
    try {
        console.log(req.body.relatedNews)
        let data = {
            cate: req.body.cate,
            name: req.body.name,
            relatedWords: JSON.stringify(req.body.relatedWords),
            relatedNews: JSON.stringify(req.body.relatedNews),
            wordRank: req.body.wordRank,
            importance: req.body.importance,
        }
        let result = await wordModel.insertWord(data);
        res.status(200).json(result);
    } catch (e) {
        console.log(e)
        res.json(e)
    }
}

const deleteWord = async function (req, res) {
    try {
        let wordSeq = req.body.seq;
        let result = await wordModel.deleteWord(wordSeq);
        res.status(200).json(result);
    } catch (e) {
        console.log(e)
        res.json(e)
    }

}

// const getNewsData = async function(req, res){
//     /*
//         정치        100
//         경제        101
//         사회        102
//         생활/문화   103
//         IT/과학     104
//         세계        105
//     */
//     try{
//         let newsCode = req.body.code
//         let mainUrl = `https://news.naver.com/main/main.naver?mode=LSD&mid=shm&sid1=${newsCode}`
//         // let content = ""
//         const main = await getHtml(mainUrl)
//         .then(data => {
//             var ulList = []
//             const $ = cheerio.load(data)
//             const $bodyList = $("div.cluster").children("div.cluster_group")
//             $bodyList.each(function(idx, val) {
//                 let url = $(this).find("div.cluster_text a").attr("href")
//                 let split = url.split('/')
//                 let id = split[split.length - 1].split('?')[0]
//                 ulList[idx] = {
//                     "id": id,
//                     "code": newsCode,
//                     "title": $(this).find("div.cluster_text a").text(),
//                     "url" : url,
//                     "content": ""
//                 }
//             })
//             return ulList
//         })

//         const content = await main.reduce(async (prev, current, index, array) =>{
//             const result = await prev.then()        
//             const data = await getHtml(current.url).then(async (data) => {
//                 const $ = cheerio.load(data)
//                 const $content = $("div._article_content").text()
//                 const $regDate  = $("span._ARTICLE_DATE_TIME").attr("data-date-time")
//                 Date()
//                 const $modDate  = $("span._ARTICLE_MODIFY_DATE_TIME").attr("data-date-time")
//                 array[index]["content"] = $content
//                 array[index]["regDate"] = $regDate
//                 array[index]["modDate"] = $modDate
//                 check = await wordModel.getRawDataById(array[index]['id'])
//                 if(check == ""){
//                     await wordModel.insertRawData(array[index])
//                 }   
//             })
//         }, Promise.resolve([]))
//         res.status(200).json(main)
//     } catch(e) {
//         console.log(e)
//         res.json(e)
//     }
// }

const getRawData = async function (req, res) {
    try{
        let result = await wordModel.getRawData()
        res.status(200).json(result)
    } catch (e) {
        console.log(e)
        res.json(e)
    }
}

const getRankingData = async function (req, res) {
    /*
        정치        100
        경제        101
        사회        102
        생활/문화   103
        IT/과학     104
        세계        105
    */
        try{
            let mainUrl = `https://news.naver.com/main/ranking/popularDay.naver`
            // let content = ""
            const main = await getHtml(mainUrl)
            .then(data => {
                var ulList = []
                const $ = cheerio.load(data)
                const $bodyList = $("div._officeCard").children("div.rankingnews_box")
                
                $bodyList.each(function() {
                    let newsName = $(this).find("strong.rankingnews_name").text()
                    let $li = $(this).find("ul.rankingnews_list li")
                    $li.each(function() {
                        let error = $(this).find("p.rankingnews_error").text().length
                        if(!error){
                            let num = $(this).find("em.list_ranking_num").text()
                            let title = $(this).find("div.list_content a").text()
                            let url = $(this).find("div.list_content a").attr("href")
                            let split = url.split('/')
                            id = split[split.length - 1].split('?')[0]
                            let data = {
                                "id": id,
                                "news": newsName,
                                "num": num,
                                "title": title,
                                "url": url
                            }
                            ulList.push(data)
                        }
                    })
                    

                    // ulList[idx] = {
                    //     "id": id,
                    //     "code": newsCode,
                    //     "title": $(this).find("div.cluster_text a").text(),
                    //     "url" : url,
                    //     "content": ""
                    // }
                })

                return ulList
            })

            const content = await main.reduce(async (prev, current, index, array) =>{
                const result = await prev.then()        
                const data = await getHtml(current.url).then(async (data) => {
                    const $ = cheerio.load(data)
                    const $category = $("ul.Nlnb_menu_list").children("li.is_active").text()
                    const $content = $("div._article_content").text()
                    const $regDate  = $("span._ARTICLE_DATE_TIME").attr("data-date-time")
                    const $modDate  = $("span._ARTICLE_MODIFY_DATE_TIME").attr("data-date-time")
                    array[index]["code"] = $category
                    array[index]["content"] = $content
                    array[index]["regDate"] = $regDate
                    array[index]["modDate"] = $modDate
                    check = await wordModel.getRawDataById(array[index]['id'])
                    if(check == "") await wordModel.insertRawData(array[index])
                })
            }, Promise.resolve([]))
            res.status(200).json("success")
        } catch(e) {
            console.log(e)
            res.json(e)
        }
}

const updateRawData = async function (req, res) {
    try{
        let id = req.body.id
        let result = await wordModel.updateRawData(id)
        res.status(200).json(result)
    } catch (e) {
        console.log(e)
        res.json(e)
    }
}

// const getAllNewsInfo = async function (req, res) {
//     try {
//         let mainUrl = "https://news.naver.com/main/main.naver?mode=LSD&mid=shm&sid1=100"
//         // let content = ""
//         const main = await getHtml(mainUrl)
//         .then(data => {
//             var ulList = []
//             const $ = cheerio.load(data)
//             const $bodyList = $("div.cluster").children("div.cluster_group")
//             $bodyList.each(function(idx, val) {
//                 ulList[idx] = {
//                     "title": $(this).find("div.cluster_text a").text(),
//                     "url" : $(this).find("div.cluster_text a").attr("href")
//                 }
//         })
//         return ulList
//         })
//         const content = await main.reduce(async (prev, current, index, array) =>{
//             const result = await prev.then()        
//             const data = await getHtml(current.url).then(data => {
//                 const $ = cheerio.load(data)
//                 const $content = $("div._article_content").text()
//                 array[index]["content"] = $content
//                 return $content
//             })
//         }, Promise.resolve([]))
        
//         res.status(200).json(main)
//         } catch (e) {
//         res.json(e)
//     }
// }

const getHtml = (url) => {
    try {
        return new Promise(async (resolve) => {
            const res = await axios({
            method: "GET",
            url: url,
            responseType: "arraybuffer"
            }).then(html => {
                const contentType = html.headers["content-type"]
                const charset = contentType.includes("charset=")
                ? contentType.split("charset=")[1] : 'UTF-8'
                const content = Iconv.decode(html.data, charset).toString();
                return content
            })
            resolve(res)
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getWords,
    insertWord,
    deleteWord,
    // getNewsData,
    getRawData,
    getRankingData,
    updateRawData
}
