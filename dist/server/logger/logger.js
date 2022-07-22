"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const log4js_1 = require("log4js");
(0, log4js_1.configure)({
    appenders: {
        app: { type: "file", filename: "logs.log" },
        out: { type: 'stdout' }
    },
    categories: {
        default: {
            appenders: ["app", "out"],
            level: 'info'
        }
    }
});
const logger = (0, log4js_1.getLogger)();
exports.logger = logger;
