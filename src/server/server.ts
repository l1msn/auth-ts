//Инициализация библиотек
import express, {Application} from 'express';
import cors from "cors"
import cookieParser from "cookie-parser";
import mongoose  from "mongoose";
import dotenv from "dotenv";

dotenv.config();

//Инициализация модулей !!! исправить !!!
import {logger} from "./logger/logger"
/*
const router = require("./routes/index");
const errorMiddleware = require("./middleware/errorMiddleware")

 */
//Инициализируем Express
const app: Application = express();

//Константы
const PORT: string | number = process.env.PORT || 5000;
const DB_URI: string = "mongodb://" +
    (process.env.MONGO_HOST || "127.0.0.1")
    + ":" + (process.env.MONGO_PORT || "27017")
    + "/" + (process.env.MONGO_NAME || "auth");

//Инициализируем возможность работы с json
app.use(express.json());
//Инициализируем возможность работы с cookieParser
app.use(cookieParser());
//Инициализируем возможность работы с cors
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));

/*
//Маршрутизация
app.use("/auth",router);

app.use(errorMiddleware);

 */

//Запускаем сервер
(async ()=>{
    try {
        //Подключаемся к БД
        await mongoose.connect(DB_URI).catch((error)=>{
            logger.error(error);
            throw new Error("Error on connecting to DB");
        });

        logger.info("Access connecting to DB to URI: " + DB_URI);

        //Прослушиваем сервер
        app.listen(PORT,()=>{
            logger.info("Server is working on http://localhost:" + PORT);
        });
    } catch (error: any) {
        logger.error(error);
        logger.warn("Error on load server");
    }
})();