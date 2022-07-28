//Инициализация библиотек
import {Router} from "express";

//Инициализация модулей
import routeValidate from "./validators/routeValidate";
import userController from "../controllers/userController";
import authMiddleware from "../middleware/authMiddleware";

//Инициализируем Роутера
const router: Router = Router();


//Запросы Роутера
//URL, Валидация, Контроллер управления
router.post("/registration",
    routeValidate.emailValidate(),
    routeValidate.passwordValidate(),
    userController.registration);
router.post("/login",
    routeValidate.emailValidate(),
    routeValidate.passwordValidate(),
    userController.login);
router.post("/logout",
    routeValidate.tokenValidate()
    , userController.logout);
router.get("/activate/:link",
    routeValidate.linkValidate()
    , userController.activate);
router.get("/refresh",
    routeValidate.tokenValidate()
    , userController.refresh);
router.get("/users", authMiddleware, userController.getUsers);


//Экспортируем данный модуль
export default router;