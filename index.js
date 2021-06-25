require("dotenv").config()
const express = require("express")
const http = require("http");
const cors = require("cors")
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose")
const router= require(`./router/index`)
const errorMiddleware = require(`./middlewares/error-middleware`)
const WebSocketServer = require('ws');
const getWs = require('./ws/ws');
const jwt = require(`jsonwebtoken`)


const PORT = process.env.PORT || 7000
const app = express()

app.use(express.json())
app.use(cookieParser()) // подключает res.cookie(`refreshToken`, userDate.refreshToken, )
app.use(cors({
    credentials:true, // разрешаем куки
    origin:process.env.CLIENT_URL
}))
app.use(`/api`,router)

app.use(errorMiddleware) // !!должен быть последним middleware
const server = http.createServer(app);
const webSocketServer = new WebSocketServer.Server({server});

const start = async () => {
    try {
        await mongoose.connect(process.env.BD_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        webSocketServer.on('connection',  async (ws, url,) => {
            const token = url.url.split("=")[1]
            const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            await  getWs(ws,url,user)
        });
        app.listen(PORT, () => console.log(`сервер стартанул порт: ${PORT}`))
        server.listen(PORT,`192.168.35.2`,  () => console.log(`сервер стартанул порт: ${PORT}`))

    } catch (e) {
        console.log(e)
    }
}

start()
