//Инициализация библиотек
const Router = require("express").Router;
const validator = require("express-validator")

//Инициализация модулей
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

//Инициализируем Роутера
const router = Router();


//Запросы Роутера
//URL, Валидация, Контроллер управления
router.post("/registration",
    validator.body("email").notEmpty().withMessage("must be at not empty")
        .isEmail().withMessage("must be a email"),
    validator.body("password").notEmpty().withMessage("must be at not empty").
    isLength({min: 3, max: 30}).withMessage("must be min 3 and max 30 characters"),
    userController.registration);
router.post("/login",
    validator.body("email").notEmpty().withMessage("must be at not empty")
        .isEmail().withMessage("must be a email"),
    validator.body("password").notEmpty().withMessage("must be at not empty").
    isLength({min: 3, max: 30}).withMessage("must be min 3 and max 30 characters")
    , userController.login);
router.post("/logout",
    validator.cookie("refreshToken").notEmpty()
    ,userController.logout);
router.get("/activate/:link",
    validator.param("activationLink").notEmpty()
    ,userController.activate);
router.get("/refresh",
    validator.cookie("refreshToken").notEmpty()
    ,userController.refresh);
router.get("/users", authMiddleware, userController.getUsers);


//Экспортируем данный модуль
module.exports = router;