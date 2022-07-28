//Инициализация библиотек
import nodeMailer from "nodemailer";
import logger from "../logger/logger"
import dotenv from "dotenv";

dotenv.config();

//Инициализация модулей

/**
 * @description - Класс сервис для отправки сообщения для активации пользователя
 * @class
 */
class emailService {
    transporter: nodeMailer.Transporter;

    //Настройка стандартной конфигурации почты рассылки
    constructor() {
        this.transporter = nodeMailer.createTransport({
            //Сервис почты
            // @ts-ignore
            service: "Gmail",
            //Хост почты
            host: process.env.SMTP_HOST,
            //Порт почты
            port: process.env.SMTP_PORT,
            //Защита по протоколу
            secure: false,
            //Данные для аутентификации почты
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
    }

    /**
     * @description - Метод отправки сообщения
     * @method
     * @async
     * @param to - почта куда отправляется сообщение
     * @param link - ссылка активации
     */
    async sendActivationEmail(to: string, link: string): Promise<void> {
        logger.info("Sending email...")
        //Отправка сообщения
        await this.transporter.sendMail({
            //От кого
            from: process.env.SMTP_USER,
            //Для кого
            to,
            //Заголовок
            subject: "Активация аккаунта на " + ("http://localhost:" + process.env.PORT),
            //Текст сообщения
            text: "",
            html:
                `
                <div>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${link}">${link}</a>
                </div>>
            `//Отлавливаем ошибки
        }, (error) => {
            if (error) {
                logger.error("Email could not sent due to error!");
                logger.error(error);
            } else {
                logger.info("Email has been sent successfully!");
            }
        });
    }
}

//Экспортируем данный модуль
export default new emailService();