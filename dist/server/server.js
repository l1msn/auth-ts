"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Инициализация библиотек
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//Инициализация модулей !!! исправить !!!
const logger_1 = require("./logger/logger");
/*
const router = require("./routes/index");
const errorMiddleware = require("./middleware/errorMiddleware")

 */
//Инициализируем Express
const app = (0, express_1.default)();
//Константы
const PORT = process.env.PORT || 5000;
const DB_URI = "mongodb://" +
    (process.env.MONGO_HOST || "127.0.0.1")
    + ":" + (process.env.MONGO_PORT || "27017")
    + "/" + (process.env.MONGO_NAME || "auth");
//Инициализируем возможность работы с json
app.use(express_1.default.json());
//Инициализируем возможность работы с cookieParser
app.use((0, cookie_parser_1.default)());
//Инициализируем возможность работы с cors
app.use((0, cors_1.default)({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
/*
//Маршрутизация
app.use("/auth",router);

app.use(errorMiddleware);

 */
//Запускаем сервер
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Подключаемся к БД
        yield mongoose_1.default.connect(DB_URI).catch((error) => {
            logger_1.logger.error(error);
            throw new Error("Error on connecting to DB");
        });
        logger_1.logger.info("Access connecting to DB to URI: " + DB_URI);
        //Прослушиваем сервер
        app.listen(PORT, () => {
            logger_1.logger.info("Server is working on http://localhost:" + PORT);
        });
    }
    catch (error) {
        logger_1.logger.error(error);
        logger_1.logger.warn("Error on load server");
    }
}))();
