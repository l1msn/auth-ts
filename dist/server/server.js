"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const logger_1 = __importDefault(require("./logger/logger"));
app_1.default.listen(process.env.PORT, () => {
    logger_1.default.info('Server is working on http://localhost:' + process.env.PORT);
    logger_1.default.info('Database is working on ' +
        'mongodb://' + process.env.MONGO_HOST + ':' +
        process.env.MONGO_PORT + '/' + process.env.MONGO_NAME);
    logger_1.default.info('Swagger API is working on http://localhost:' + process.env.PORT + '/api');
    logger_1.default.info('GraphQL interface working on http://localhost:' + process.env.PORT + '/graphql/');
});
