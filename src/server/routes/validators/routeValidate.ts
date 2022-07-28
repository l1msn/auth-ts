import {ValidationChain, body, param, cookie} from "express-validator";

class RouteValidate {
    static emailValidate(): ValidationChain {
        return body("email").notEmpty().withMessage("must be at not empty").isEmail().withMessage("must be a email");
    }

    static passwordValidate(): ValidationChain {
        return body("password").notEmpty().withMessage("must be at not empty").isLength({
            min: 3,
            max: 30
        }).withMessage("must be min 3 and max 30 characters");
    }

    static tokenValidate(): ValidationChain {
        return param("activationLink").notEmpty();
    }

    static linkValidate(): ValidationChain {
        return cookie("refreshToken").notEmpty();
    }
}

export default RouteValidate;