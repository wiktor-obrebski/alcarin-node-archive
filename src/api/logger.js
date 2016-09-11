import * as winston from 'winston'

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            prettyPrint: true,
            colorize: true,
            tty: true,
        })
    ],
});
logger.cli();

export default logger;
