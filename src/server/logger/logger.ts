import { getLogger, configure} from "log4js";

configure({
   appenders: {
       app: {type: "file", filename: "logs.log"},
       out: {type: 'stdout'}
   },
    categories: {
       default: {
           appenders: ["app", "out"],
           level: 'info'
       }
    }
});

export default getLogger();
