import winston from "winston";
import config from "./config/config.js";

const customWinstonLevels = {
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
  },
  colors: {
    debug: "white",
    http: "yellow",
    info: "blue",
    warning: "red",
    error: "green",
    fatal: "magenta",
  },
};

winston.addColors(customWinstonLevels.colors);

const createLogger = (env) => {
  if (env === "PROD") {
    return winston.createLogger({
      levels: customWinstonLevels.levels,
      transports: [
        new winston.transports.File({
          filename: "server.log",
          level: "fatal",
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
          
        }),
      ],
    });
  } else {
    return winston.createLogger({
      levels: customWinstonLevels.levels,
      transports: [
        new winston.transports.Console({
          level: "fatal",
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
      ],
    });
  }
};

const logger = createLogger(config.logger.newLogger);


export default logger;