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
const path = require('path');
const multer  = require('multer');

const PORT = process.env.PORT || 7000
const app = express()
const isProduction = process.env.NODE_ENV === 'production';


app.use(express.json())
/*app.use(express.static('public'));*/
app.use('/public', express.static('public'));
app.use(cookieParser()) // подключает res.cookie(`refreshToken`, userDate.refreshToken, )
app.use(cors({
    credentials:true, // разрешаем куки
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: true,
    optionsSuccessStatus: 204,
   // origin: isProduction? process.env.CLIENT_URL : process.env.DEV_CLIENT_URL
    //origin: [""+process.env.CLIENT_URL, ""+process.env.DEV_CLIENT_URL, /\.herokuapp\.com$/]
    //origin: /\.herokuapp\.com$/
    //origin: process.env.DEV_CLIENT_URL,
    origin: process.env.CLIENT_URL,
}))
app.use(`/api`,router)

app.use(express.static(path.join(__dirname, 'public')));
app.use(function (err, req, res, next) {
    if (err instanceof multer.MulterError) res.status(500).send(err.message);
    else next(err);
});


app.use(errorMiddleware) // !!должен быть последним middleware
const server = http.createServer(app);
const webSocketServer = new WebSocketServer.Server({server});

const start = async () => {
    try {
        await mongoose.connect(process.env.BD_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex:true,
        },function(error) {
            if(error) console.log(`error  mongoose.connect : ${error}`)
        })
        webSocketServer.on('connection',  async (ws, url,) => {
            try{
                const token = url.url.split("=")[1]
                const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
                await  getWs(ws,url,user)
            }catch (e) {
                console.log(`ошибка webSocketServer: ${e}`)
            }
        });
        server.listen(PORT,  () => console.log(`сервер стартанул порт: ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}

start()
