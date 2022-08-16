// 'use strict'
const express = require("express");
const router = express.Router();

const wordController    = require("../controllers/wordController")
const authController    = require("../controllers/authController")
const replyController   = require("../controllers/replyController")
const rankController    = require("../controllers/rankController")

    /**
     * @swagger
     *  /api/auth/login:
     *    post:
     *      tags:
     *      - auth
     *      description: username과 password로 API에 로그인합니다. token을 return합니다.
     *      parameters:
     *      - in: body
     *        name: Request
     *        schema:
     *          $ref: '#/definitions/login'
     *      responses:
     *        200:
     *          description: Successfully login
     *          schema:
     *            properties:
     *              status:
     *                type: string
     *              data:
     *                type: object
     *                properties:
     *                  auth:
     *                    type: boolean
     *                  token:
     *                    type: string
     *                  faId:
     *                    type: string
     *                  roles:
     *                    type: string
     */
    router.post("/api/auth/login",               authController.login), 

    /**
     * @swagger
     *  /api/auth/me:
     *    get:
     *      tags:
     *      - auth
     *      description: login
     *      produces:
     *      - application/json
     *      responses:
     *       200:
     *        description:
     */

    router.get("/api/auth/me",                   authController.me),
    /**
     * @swagger
     *  /api/auth/refresh:
     *    get:
     *      tags:
     *      - auth
     *      description: login
     *      produces:
     *      - application/json
     *      responses:
     *       200:
     *        description:
     */
    router.get("/api/auth/refresh",              authController.refresh),
    /**
     * @swagger
     *  /api/users:
     *    get:
     *      tags:
     *      - auth
     *      description: login
     *      produces:
     *      - application/json
     *      responses:
     *       200:
     *        description:
     */
     router.get("/api/users",                     authController.getUsers),
         /**
     * @swagger
     *  /api/users/{username}:
     *    get:
     *      tags:
     *      - auth
     *      description: login
     *      produces:
     *      - application/json
     *      responses:
     *       200:
     *        description:
     */
     router.get("/api/users/{username}",          authController.getUserByName),
         /**
     * @swagger
     *  /api/users:
     *    post:
     *      tags:
     *      - auth
     *      description: login
     *      produces:
     *      - application/json
     *      responses:
     *       200:
     *        description:
     */
     router.post("/api/users",                    authController.insertUser),
         /**
     * @swagger
     *  /api/users/{username}:
     *    put:
     *      tags:
     *      - auth
     *      description: login
     *      produces:
     *      - application/json
     *      responses:
     *       200:
     *        description:
     */
     router.put("/api/users/{username}",          authController.updateUser),
         /**
     * @swagger
     *  /api/users/{username}:
     *    delete:
     *      tags:
     *      - auth
     *      description: login
     *      produces:
     *      - application/json
     *      responses:
     *       200:
     *        description:
     */
     router.delete("/api/users/{username}",       authController.deleteUser),

    /**
     * @swagger
     *  /api/getWords/{startDate}/{endDate}:
     *    get:
     *      tags:
     *      - word
     *      description: 모든 토픽 조회
     *      parameters:
     *      - in: path
     *        name: startDate
     *        required: true
     *        schema:
     *          type: string
     *          format: date
     *          description: 시작 날짜
     *      - in: path
     *        name: endDate
     *        required: true
     *        schema:
     *          type: string
     *          format: date
     *          description: 종료 날짜
     *      produces:
     *      - application/json
     *      responses:
     *       200:
     *        description: 모든 토픽 조회
     */
    router.get("/api/getWords/:startDate/:endDate",               wordController.getWords)

    /**
     * @swagger
     *  /api/insertWord:
     *    post:
     *      tags:
     *      - word
     *      description: 새로운 워드를 추가합니다.
     *      parameters:
     *      - in: body
     *        name: Request
     *        description: 모든 값을 알맞게 넣어주세요.
     *        schema:
     *          $ref: '#/definitions/insertWord'
     *      produces:
     *      - application/json
     *      responses:
     *       200:
     *        description: 생성이 완료되었습니다.
     * definitions:
     *  insertWord:
     *    type: object
     *    required:
     *      - cate
     *      - name
     *      - importance
     *    properties:
     *      cate:
     *        type: string
     *      name:
     *        type: string
     *      relatedWords:
     *        type: array
     *        items: 
     *          type: string
     *      relatedNews:
     *        type: array
     *        items: 
     *          type: object
     *          properties:
     *            url:
     *              type: string
     *            title: 
     *              type: string
     *      importance:
     *        type: integer
     */
     router.post("/api/insertWord",               wordController.insertWord)
    /**
     * @swagger
     *  /api/deleteWord:
     *    post:
     *      tags:
     *      - word
     *      description: 특정 토픽을 삭제합니다.
     *      parameters:
     *      - in: body
     *        name: Request
     *        description: 모든 값을 알맞게 넣어주세요.
     *        schema:
     *          $ref: '#/definitions/deleteWord'
     *      produces:
     *      - application/json
     *      responses:
     *       200:
     *        description: 삭제가 완료되었습니다.
     * definitions:
     *  deleteWord:
     *    type: object
     *    required:
     *      - seq
     *    properties:
     *      seq:
     *        type: integer
     */
     router.post("/api/deleteWord",               wordController.deleteWord)

    /**
     * @swagger
     *  /api/getNewsData:
     *    post:
     *      tags:
     *      - word
     *      description: (크롤링) 코드 값에 따라 뉴스 데이터를 가져옵니다.<br>
     *          <table>
     *             <tr>
     *                <td>항목</td>
     *                <td>코드</td>
     *            </tr>
     *            <tr>
     *                <td>정치</td>
     *                <td>100(default)</td>
     *            </tr>
     *            <tr>
     *                <td>경제</td>
     *                <td>101</td>
     *            </tr>
     *            <tr>
     *                <td>사회</td>
     *                <td>102</td>
     *            </tr>
     *            <tr>
     *                <td>생활/문화</td>
     *                <td>103</td>
     *            </tr>
     *            <tr>
     *                <td>IT/과학</td>
     *                <td>104</td>
     *            </tr>
     *            <tr>
     *                <td>세계</td>
     *                <td>105</td>
     *            </tr>
     *          </table>
     *      parameters:
     *      - in: body
     *        name: Request
     *        description: 모든 값을 알맞게 넣어주세요.
     *        schema:
     *          $ref: '#/definitions/getNewsData'
     *      produces:
     *      - application/json
     *      responses:
     *       200:
     *        description: Success
     * definitions:
     *  getNewsData:
     *    type: object
     *    required:
     *      - code
     *    properties:
     *      code:
     *        type: integer
     *        default: 100
     */
    //  router.post("/api/getNewsData",               wordController.getNewsData)

    /**
     * @swagger
     *  /api/getRankingData:
     *    post:
     *      tags:
     *      - word
     *      description: 네이버 뉴스 RAW DB 조회
     *      produces:
     *      - application/json
     *      responses:
     *       200:
     *        description:  네이버 뉴스 RAW DB 조회
     */
     router.post("/api/getRankingData",        wordController.getRankingData)

    /**
     * @swagger
     *  /api/getRawData:
     *    get:
     *      tags:
     *      - word
     *      description: 네이버 뉴스 RAW DB 조회
     *      produces:
     *      - application/json
     *      responses:
     *       200:
     *        description:  네이버 뉴스 RAW DB 조회
     */
     router.get("/api/getRawData",        wordController.getRawData)

    /**
     * @swagger
     *  /api/getRawDataByKeyword:
     *    post:
     *      tags:
     *      - word
     *      description: 네이버 뉴스 RAW DB 조회
     *      parameters:
     *      - in: body
     *        name: Request
     *        description: 모든 값을 알맞게 넣어주세요.
     *        schema:
     *          $ref: '#/definitions/getRawDataByKeyword'
     *      produces:
     *      - application/json
     *      responses:
     *       200:
     *        description:  네이버 뉴스 RAW DB 조회
     */
     router.post("/api/getRawDataByKeyword",        wordController.getRawDataByKeyword)

    /**
     * @swagger
     *  /api/updateRawData:
     *    post:
     *      tags:
     *      - word
     *      description: 분석이 완료된 Raw Data를 사용완료 상태로 변환합니다.
     *      produces:
     *      - application/json
     *      responses:
     *       200:
     *        description:  완료
     *      parameters:
     *      - in: body
     *        name: Request
     *        description: 모든 값을 알맞게 넣어주세요.
     *        schema:
     *          $ref: '#/definitions/updateRawData'
     * definitions:
     *  updateRawData:
     *    type: object
     *    required:
     *      - id
     *    properties:
     *      id:
     *        type: integer
     */
    router.post("/api/updateRawData",          wordController.updateRawData)

    /**
     * @swagger
     *  /api/getReply/{word}:
     *    get:
     *      tags:
     *      - reply
     *      description: 
     *      parameters:
     *      - in: path
     *        name: word
     *        required: true
     *        schema:
     *          type: string
     *          format: date
     *          description: 시작 날짜
     *      produces:
     *      - application/json
     *      responses:
     *       200:
     *        description: 모든 토픽 조회
     */
    router.get("/api/getReply/:word",                    replyController.getReply)

    /**
     * @swagger
     *  /api/insertReply:
     *    post:
     *      tags:
     *      - reply
     *      description: 
         *      parameters:
     *      - in: body
     *        name: Request
     *        description: 모든 값을 알맞게 넣어주세요.
     *        schema:
     *          $ref: '#/definitions/insertReply'
     *      produces:
     *      - application/json
     *      responses:
     *       200:
     *        description: 생성이 완료되었습니다.
     * definitions:
     *  insertReply:
     *    type: object
     *    required:
     *     - keyword
     *     - parentReplySeq
     *     - comment
     *     - nickname
     *     - password
     *    properties:
     *      keyword:
     *        type: string
     *      parentReplySeq:
     *        type: integer
     *      comment:
     *        type: string
     *      nickname:
     *        type: string
     *      password:
     *        type: string
     */
    
    router.post("/api/insertReply",                 replyController.insertReply)

    /**
     * @swagger
     *  /api/deleteReply:
     *    post:
     *      tags:
     *      - reply
     *      description: 
     *      produces:
     *      - application/json
     *      responses:
     *       200:
     *        description:
     */
    router.post("/api/deleteReply",                 replyController.deleteReply)

    /**
     * @swagger
     *  /api/updateReply:
     *    post:
     *      tags:
     *      - reply
     *      description: 
     *      produces:
     *      - application/json
     *      responses:
     *       200:
     *        description:
     */
    router.post("/api/updateReply",                 replyController.updateReply)


    /**
     * @swagger
     *  /api/getRank/{word}/{startDate}/{endDate}:
     *    get:
     *      tags:
     *      - rank
     *      description: 
     *      parameters:
     *      - in: path
     *        name: word
     *        required: true
     *        schema:
     *          type: string
     *      - in: path
     *        name: startDate
     *        required: true
     *        schema:
     *          type: string
     *          format: date
     *          description: 시작 날짜
     *      - in: path
     *        name: endDate
     *        required: true
     *        schema:
     *          type: string
     *          format: date
     *          description: 종료 날짜
     *      produces:
     *      - application/json
     *      responses:
     *       200:
     *        description: 모든 토픽 조회
     */
         router.get("/api/getRank/:word/:startDate/:endDate",                    rankController.getRankByWord)
    
router.get('/', (req, res) => {
    res.send('404 . Not Found!')
  })

module.exports = router;