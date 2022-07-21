const swaggerUi = require("swagger-ui-express")
const swaggerJsdoc = require("swagger-jsdoc")

const options = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "오늘의 단어",
      description:
        "Description : 오늘의 단어 Restful Api Client",
    },
    servers: [
      {
        url: "http://localhost:5002", // 요청 URL
      },
    ],
  },
  apis: ["./routes/*.js", "./routers/user/*.js"], //Swagger 파일 연동
}
const specs = swaggerJsdoc(options)

module.exports = { swaggerUi, specs }