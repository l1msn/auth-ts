import app from "./app";
import logger from "./logger/logger"

app.listen(process.env.PORT, () => {
    logger.info("Server is working on http://localhost:" + process.env.PORT);
    logger.info("Database is working on " +
        "mongodb://" + process.env.MONGO_HOST + ":" +
        process.env.MONGO_PORT + "/" + process.env.MONGO_NAME);
})