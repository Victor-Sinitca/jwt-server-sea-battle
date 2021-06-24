require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose")
const router= require(`./router/index`)
const errorMiddleware = require(`./middlewares/error-middleware`)


const PORT = process.env.PORT || 8000
const app = express()
app.use(express.json())
app.use(cookieParser()) // подключает res.cookie(`refreshToken`, userDate.refreshToken, )
app.use(cors({
    credentials:true, // разрешаем куки
    origin:process.env.CLIENT_URL
}))
app.use(`/api`,router)

app.use(errorMiddleware) // !!должен быть последним middleware



const start = async () => {
    try {
        await mongoose.connect(process.env.BD_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => console.log(`сервер стартанул порт: ${PORT}`))

    } catch (e) {
        console.log(e)
    }
}

start()
