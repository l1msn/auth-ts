//Инициализация библиотек
import express from 'express';
import cors from "cors"
import cookieParser from "cookie-parser";
import mongoose  from "mongoose";
import dotenv from "dotenv";

dotenv.config();

//Инициализация модулей
import logger from "./logger/logger"
import router from "./routes/index";
import errorHandler from "./middleware/errorMiddleware";

class App {
    public express: express.Application = express();

    constructor() {
        try {
            logger.info("Loading Application...");

            this.database();
            this.middlewares();
            this.routes();
            this.errors();

            logger.info("Success load Application.");
        } catch (error: unknown | Error) {
            logger.warn("Error on creating Application object!");
            logger.error(error);

        }
    }

    private database() {
        try {
            logger.log("Database connecting...");

            mongoose.connect(
                "mongodb://" + process.env.MONGO_HOST as string + ":" + process.env.MONGO_PORT as string + "/" + process.env.MONGO_NAME as string
            ).catch(()=> {throw new Error("Error on mongoose connect!")});

            logger.log("Database connected.");
        } catch (error: unknown | any) {
            logger.warn("Error on connection to DataBase of Application!");
            logger.error(error);
        }
    }

    private middlewares() {
        try {
            logger.log("Middlewares including...");

            //Инициализируем возможность работы с json
            this.express.use(express.json());
            //Инициализируем возможность работы с cookieParser
            this.express.use(cookieParser());
            //Инициализируем возможность работы с cors
            this.express.use(cors({
                credentials: true,
                origin: process.env.CLIENT_URL
            }));

            logger.log("Middlewares included.");
        } catch (error: unknown | any) {
            logger.warn("Error on including middlewares of Application!");
            logger.error(error);
        }
    }
    private routes() {
        try {
            logger.log("Middlewares including...");

            //Маршрутизация
            this.express.use("/auth", router);

            logger.log("Middlewares included.");
        } catch (error: unknown | any) {
            logger.warn("Error on including routes of Application!");
            logger.error(error);
        }
    }
    private errors() {
        try{
            logger.log("Error middleware including...");

            //Обработчик ошибок
            this.express.use(errorHandler);

            logger.log("Error middleware included.");
        } catch (error: unknown | any) {
            logger.warn("Error on creating including Error Middleware object!");
            logger.error(error);
        }
    }
}

export default new App().express;
